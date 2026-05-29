import * as fs from 'fs'
import * as path from 'path'
import { createHash } from 'crypto'

// Load .env.local manually BEFORE any Firebase imports
const envPath = path.resolve(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    const unquoted = value.replace(/^["']|["']$/g, '')
    if (!process.env[key]) {
      process.env[key] = unquoted
    }
  }
}

const CATALOGUE_DIR = path.join(__dirname, '..', 'CATALOGUE')
const ROOT_CATALOGUE_PDF = path.join(__dirname, '..', 'ALTERNATE CATALOGUE.pdf')
const PRODUCT_IMAGES_COLLECTION = 'product_images'
const STORAGE_PREFIX = 'catalogue'

const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
  '.heic', '.heif',
])
const PDF_EXTENSION = '.pdf'

interface ProductImageRecord {
  name: string
  originalName: string
  url: string
  storagePath: string
  type: 'image' | 'pdf'
  fileType: string
  size: number
  fileHash: string
  createdAt: import('firebase/firestore').Timestamp
}

function getFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath)
  return createHash('md5').update(content).digest('hex')
}

function walkDir(dir: string): string[] {
  const files: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.')) {
        files.push(...walkDir(fullPath))
      }
    } else {
      files.push(fullPath)
    }
  }
  return files
}

function sanitizePath(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function uploadCatalogue() {
  console.log('=== ALTERNATE ENTERPRISES — Catalogue Uploader ===\n')

  // Dynamic imports so env vars are set first
  const { initializeApp } = await import('firebase/app')
  const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
  const {
    getFirestore,
    collection,
    Timestamp,
    setDoc,
    doc,
    query,
    getDocs,
  } = await import('firebase/firestore')

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  // Validate config
  const missingVars = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missingVars.length) {
    console.error(`Missing env vars: ${missingVars.join(', ')}`)
    console.error('Make sure .env.local exists with all NEXT_PUBLIC_FIREBASE_* variables.')
    process.exit(1)
  }

  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)
  const db = getFirestore(app)

  // Verify bucket is accessible
  if (!firebaseConfig.storageBucket) {
    console.error('storageBucket is not set in firebaseConfig! Check .env.local')
    process.exit(1)
  }

  console.log(`Project: ${firebaseConfig.projectId}`)
  console.log(`Bucket:  ${firebaseConfig.storageBucket}\n`)

  // Get existing hashes to deduplicate
  const q = query(collection(db, PRODUCT_IMAGES_COLLECTION))
  const existingSnapshot = await getDocs(q)
  const existingHashes = new Set(existingSnapshot.docs.map((d) => d.data().fileHash))
  console.log(`Existing images in DB: ${existingHashes.size}\n`)

  const records: ProductImageRecord[] = []

  // 1. Upload main catalogue PDF
  if (fs.existsSync(ROOT_CATALOGUE_PDF)) {
    console.log('[PDF] ALTERNATE CATALOGUE.pdf')
    const fileHash = getFileHash(ROOT_CATALOGUE_PDF)
    if (existingHashes.has(fileHash)) {
      console.log('  ↺ Skipping (duplicate)')
    } else {
      const stats = fs.statSync(ROOT_CATALOGUE_PDF)
      const fileBuffer = fs.readFileSync(ROOT_CATALOGUE_PDF)
      const storagePath = `${STORAGE_PREFIX}/alternate-catalogue.pdf`
      const storageRef = ref(storage, storagePath)
      await uploadBytes(storageRef, fileBuffer, { contentType: 'application/pdf' })
      const downloadUrl = await getDownloadURL(storageRef)
      console.log('  ✓ Uploaded')
      records.push({
        name: 'ALTERNATE CATALOGUE',
        originalName: 'ALTERNATE CATALOGUE.pdf',
        url: downloadUrl,
        storagePath,
        type: 'pdf',
        fileType: 'application/pdf',
        size: stats.size,
        fileHash,
        createdAt: Timestamp.now(),
      })
    }
  } else {
    console.log('[PDF] Not found at root, skipping...')
  }

  // 2. Upload all images from CATALOGUE/ directory
  if (fs.existsSync(CATALOGUE_DIR)) {
    const allFiles = walkDir(CATALOGUE_DIR)
    const imagePdfFiles = allFiles.filter((f) => {
      const ext = path.extname(f).toLowerCase()
      return IMAGE_EXTENSIONS.has(ext) || ext === PDF_EXTENSION
    })

    console.log(`\n[IMAGES] Found ${imagePdfFiles.length} files in CATALOGUE/\n`)

    let uploaded = 0
    let skipped = 0
    let failed = 0

    for (const filePath of imagePdfFiles) {
      const ext = path.extname(filePath).toLowerCase()
      const isImage = IMAGE_EXTENSIONS.has(ext)
      const isPdf = ext === PDF_EXTENSION
      if (!isImage && !isPdf) continue

      const fileHash = getFileHash(filePath)
      if (existingHashes.has(fileHash)) {
        skipped++
        continue
      }

      const relativePath = path.relative(CATALOGUE_DIR, filePath)
      const sanitized = sanitizePath(relativePath)
      const storagePath = `${STORAGE_PREFIX}/images/${sanitized}`
      const stats = fs.statSync(filePath)

      try {
        const fileBuffer = fs.readFileSync(filePath)
        const storageRef = ref(storage, storagePath)
        await uploadBytes(storageRef, fileBuffer, {
          contentType: isPdf
            ? 'application/pdf'
            : ext === '.heic' || ext === '.heif'
              ? 'image/heic'
              : `image/${ext.replace('.', '')}`,
        })
        const downloadUrl = await getDownloadURL(storageRef)
        console.log(`  ✓ ${path.basename(filePath)}`)
        uploaded++

        records.push({
          name: path.basename(filePath, ext),
          originalName: path.basename(filePath),
          url: downloadUrl,
          storagePath,
          type: isPdf ? 'pdf' : 'image',
          fileType: isPdf ? 'application/pdf' : `image/${ext.replace('.', '')}`,
          size: stats.size,
          fileHash,
          createdAt: Timestamp.now(),
        })
      } catch (err) {
        console.error(`  ✗ ${path.basename(filePath)}: ${err instanceof Error ? err.message : err}`)
        failed++
      }
    }

    console.log(`\n  Results: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`)
  } else {
    console.log('\n[IMAGES] CATALOGUE/ directory not found, skipping...')
  }

  // 3. Save records to Firestore
  if (records.length > 0) {
    console.log(`\nSaving ${records.length} new records to Firestore...`)
    let saved = 0
    for (const record of records) {
      const docId = sanitizePath(record.name)
      try {
        await setDoc(doc(db, PRODUCT_IMAGES_COLLECTION, docId), record)
        saved++
      } catch (err) {
        console.error(`  ✗ Failed to save: ${record.originalName}`, err)
      }
    }
    console.log(`  ✓ Saved ${saved}/${records.length} records to '${PRODUCT_IMAGES_COLLECTION}' collection`)
  } else {
    console.log('\nNo new files to upload.')
  }

  console.log(`\n=== Done! ===`)
}

uploadCatalogue().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
