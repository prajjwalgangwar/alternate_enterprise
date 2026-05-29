import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  Timestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'

export interface Product {
  productId: string
  name: string
  category: string
  description: string
  nicotine: string
  sugar: string
  color: string
  body: string
  grade: string
  featured: boolean
  imageUrl: string
  imageUrls?: string[]
  createdAt: Timestamp
}

export type ProductInput = Omit<Product, 'productId' | 'createdAt'>

export interface ContactInquiry {
  id?: string
  name: string
  company: string
  email: string
  phone: string
  country: string
  inquiryType: string
  message: string
  createdAt: Timestamp
}

// Products Collection
export const productsCollection = collection(db, 'products')

function sortProductsNewestFirst(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
  )
}

export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(productsCollection, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<Product, 'productId'>),
      productId: doc.id,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function getFeaturedProducts(limitCount: number = 6): Promise<Product[]> {
  try {
    const q = query(
      productsCollection,
      where('featured', '==', true),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    const products = snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<Product, 'productId'>),
      productId: doc.id,
    }))
    return sortProductsNewestFirst(products)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const q = query(
      productsCollection,
      where('category', '==', category)
    )
    const snapshot = await getDocs(q)
    const products = snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<Product, 'productId'>),
      productId: doc.id,
    }))
    return sortProductsNewestFirst(products)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', productId)
    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      return {
        ...(docSnapshot.data() as Omit<Product, 'productId'>),
        productId: docSnapshot.id,
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function addProduct(product: ProductInput): Promise<string> {
  try {
    const imageUrls = product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : [])
    const docRef = await addDoc(productsCollection, {
      ...product,
      imageUrl: imageUrls[0] ?? product.imageUrl ?? '',
      imageUrls,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

export async function updateProduct(
  productId: string,
  product: Partial<ProductInput>
): Promise<void> {
  try {
    const imageUrls = product.imageUrls
    const payload = {
      ...product,
      ...(imageUrls ? { imageUrl: imageUrls[0] ?? '' } : {}),
    }
    await updateDoc(doc(db, 'products', productId), payload)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId))
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    const q = query(productsCollection, orderBy('name'))
    const snapshot = await getDocs(q)

    const searchLower = searchTerm.toLowerCase()
    return snapshot.docs
      .map((doc) => ({
        ...(doc.data() as Omit<Product, 'productId'>),
        productId: doc.id,
      }))
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      )
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

// Contact Inquiries Collection
export const contactInquiriesCollection = collection(db, 'contact_inquiries')

export async function addContactInquiry(inquiry: Omit<ContactInquiry, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(contactInquiriesCollection, {
      ...inquiry,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding contact inquiry:', error)
    throw error
  }
}

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  try {
    const q = query(contactInquiriesCollection, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ContactInquiry, 'id'>),
    }))
  } catch (error) {
    console.error('Error fetching contact inquiries:', error)
    throw error
  }
}
