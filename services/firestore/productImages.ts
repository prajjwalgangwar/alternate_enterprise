import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../lib/firebase'

export interface ProductImage {
  id: string
  name: string
  originalName: string
  url: string
  storagePath: string
  type: 'image' | 'pdf'
  fileType: string
  size: number
  fileHash: string
  createdAt: Timestamp
}

const COLLECTION_NAME = 'product_images'
const productImagesCollection = collection(db, COLLECTION_NAME)

function normalizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function getProductImages(): Promise<ProductImage[]> {
  try {
    const q = query(productImagesCollection, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ProductImage, 'id'>),
    }))
  } catch (error) {
    console.error('Error fetching product images:', error)
    throw error
  }
}

export async function deleteProductImage(
  id: string,
  storagePath: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
    if (storagePath) {
      const fileRef = ref(storage, storagePath)
      await deleteObject(fileRef)
    }
  } catch (error) {
    console.error('Error deleting product image:', error)
    throw error
  }
}

export async function uploadCatalogueImage(
  file: File,
  customName?: string
): Promise<ProductImage> {
  try {
    const ext = file.name.split('.').pop() || ''
    const baseName = customName || file.name.replace(`.${ext}`, '')
    const fileName = `${Date.now()}-${normalizeFileName(baseName)}.${normalizeFileName(ext)}`
    const storagePath = `catalogue/images/${fileName}`
    const storageRef = ref(storage, storagePath)

    await uploadBytes(storageRef, file, {
      contentType: file.type,
    })

    const downloadUrl = await getDownloadURL(storageRef)

    const docData: Omit<ProductImage, 'id'> = {
      name: baseName,
      originalName: file.name,
      url: downloadUrl,
      storagePath,
      type: file.type.startsWith('image/') ? 'image' : 'pdf',
      fileType: file.type,
      size: file.size,
      fileHash: '',
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(productImagesCollection, docData)
    return { id: docRef.id, ...docData }
  } catch (error) {
    console.error('Error uploading catalogue image:', error)
    throw error
  }
}
