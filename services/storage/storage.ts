import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage'
import { storage } from '../../lib/firebase'

const PRODUCT_IMAGES_PATH = 'products/'
const ASSETS_PATH = 'assets/'

function normalizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  try {
    const fileName = `${Date.now()}-${normalizeFileName(file.name)}`
    const storageRef = ref(storage, `${PRODUCT_IMAGES_PATH}${productId}/${fileName}`)

    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        productId,
      },
    })

    const downloadUrl = await getDownloadURL(storageRef)
    return downloadUrl
  } catch (error) {
    console.error('Error uploading product image:', error)
    throw error
  }
}

export async function uploadProductImages(
  files: File[],
  productId: string
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadProductImage(file, productId)))
}

export async function uploadAsset(
  file: File,
  assetType: 'textures' | 'hero' | 'leaves' | 'media'
): Promise<string> {
  try {
    const fileName = `${assetType}-${Date.now()}`
    const storageRef = ref(storage, `${ASSETS_PATH}${assetType}/${fileName}`)

    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        assetType,
      },
    })

    const downloadUrl = await getDownloadURL(storageRef)
    return downloadUrl
  } catch (error) {
    console.error('Error uploading asset:', error)
    throw error
  }
}

export async function getDownloadUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('Error getting download URL:', error)
    throw error
  }
}

export async function deleteFile(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file by URL:', error)
    throw error
  }
}

export async function listProductImages(productId: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, `${PRODUCT_IMAGES_PATH}${productId}`)
    const result = await listAll(folderRef)

    const urls = await Promise.all(
      result.items.map((item) => getDownloadURL(item))
    )
    return urls
  } catch (error) {
    console.error('Error listing product images:', error)
    throw error
  }
}

export async function listAssets(assetType: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, `${ASSETS_PATH}${assetType}`)
    const result = await listAll(folderRef)

    const urls = await Promise.all(
      result.items.map((item) => getDownloadURL(item))
    )
    return urls
  } catch (error) {
    console.error('Error listing assets:', error)
    throw error
  }
}
