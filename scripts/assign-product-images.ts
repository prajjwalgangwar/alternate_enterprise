import * as fs from 'fs'
import * as path from 'path'

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

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function keywords(str: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'of', 'in', 'to', 'for', 'with',
    'is', 'at', 'by', 'on', 'grade', 'traditional',
  ])
  return normalize(str)
    .split(' ')
    .filter((w) => w.length > 1 && !stopWords.has(w))
}

function matchScore(productName: string, imageName: string): number {
  const prodWords = keywords(productName)
  const imgWords = keywords(imageName)
  if (!prodWords.length || !imgWords.length) return 0

  let score = 0
  for (const pw of prodWords) {
    for (const iw of imgWords) {
      if (pw === iw) {
        score += 3
      } else if (pw.includes(iw) || iw.includes(pw)) {
        score += 2
      } else if (iw.startsWith(pw) || pw.startsWith(iw)) {
        score += 1
      }
    }
  }

  // Exact full match bonus
  if (normalize(productName) === normalize(imageName)) {
    score += 10
  }

  return score
}

interface ProductImageDoc {
  id: string
  name: string
  originalName: string
  url: string
}

interface ProductDoc {
  id: string
  name: string
  imageUrl?: string
  imageUrls?: string[]
}

async function assignImages() {
  console.log('=== Assign Product Images from Catalogue ===\n')

  const { initializeApp } = await import('firebase/app')
  const { getFirestore, collection, query, orderBy, getDocs, updateDoc, doc } = await import('firebase/firestore')

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  const missingVars = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missingVars.length) {
    console.error(`Missing env vars: ${missingVars.join(', ')}`)
    process.exit(1)
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  // 1. Fetch all product_images from Firestore
  const imagesQuery = query(collection(db, 'product_images'), orderBy('createdAt', 'desc'))
  const imageSnapshot = await getDocs(imagesQuery)
  const catalogueImages: ProductImageDoc[] = imageSnapshot.docs.map((d) => ({
    id: d.id,
    name: d.data().name || '',
    originalName: d.data().originalName || '',
    url: d.data().url || '',
  }))

  console.log(`Found ${catalogueImages.length} images in product_images collection\n`)

  if (!catalogueImages.length) {
    console.error('No images found. Run `npm run upload-catalogue` first.')
    process.exit(1)
  }

  // 2. Fetch all products
  const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  const productSnapshot = await getDocs(productsQuery)
  const allProducts: ProductDoc[] = productSnapshot.docs.map((d) => ({
    id: d.id,
    name: d.data().name || '',
    imageUrl: d.data().imageUrl || '',
    imageUrls: d.data().imageUrls || [],
  }))

  // Filter to products without images
  const productsWithoutImages = allProducts.filter(
    (p) => !p.imageUrl && (!p.imageUrls || p.imageUrls.length === 0)
  )

  console.log(`Found ${allProducts.length} total products`)
  console.log(`Found ${productsWithoutImages.length} products without images\n`)

  if (!productsWithoutImages.length) {
    console.log('All products already have images. Nothing to do.')
    process.exit(0)
  }

  // 3. Match and assign
  let assigned = 0
  let unmatched: string[] = []

  for (const product of productsWithoutImages) {
    let bestScore = 0
    let bestMatch: ProductImageDoc | null = null

    for (const img of catalogueImages) {
      const score = matchScore(product.name, img.name)
      if (score > bestScore) {
        bestScore = score
        bestMatch = img
      }
    }

    if (bestMatch && bestScore >= 2) {
      try {
        await updateDoc(doc(db, 'products', product.id), {
          imageUrl: bestMatch.url,
          imageUrls: [bestMatch.url],
        })
        console.log(`  ✓ ${product.name}`)
        console.log(`    → ${bestMatch.originalName} (score: ${bestScore})`)
        assigned++
      } catch (err) {
        console.error(`  ✗ ${product.name}: ${err}`)
      }
    } else {
      unmatched.push(product.name)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log(`Assigned: ${assigned}/${productsWithoutImages.length}`)
  console.log(`Unmatched: ${unmatched.length}`)

  if (unmatched.length) {
    console.log('\nUnmatched products:')
    for (const name of unmatched) {
      console.log(`  • ${name}`)
    }
  }

  console.log('\n=== Done ===')
}

assignImages().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
