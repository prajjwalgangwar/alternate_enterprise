import { useCallback, useState, useEffect } from 'react'
import { Product, getProducts, getFeaturedProducts, getProductsByCategory } from '@/services/firestore/products'

interface UseProductsState {
  products: Product[]
  loading: boolean
  error: string | null
}

export function useProducts() {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await getProducts()
      setState({ products: data, loading: false, error: null })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch products'
      setState({ products: [], loading: false, error: errorMessage })
    }
  }, [])

  return { ...state, refetch: fetchProducts }
}

export function useFeaturedProducts(limit: number = 6) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetchFeatured()
  }, [limit])

  const fetchFeatured = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await getFeaturedProducts(limit)
      setState({ products: data, loading: false, error: null })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch featured products'
      setState({ products: [], loading: false, error: errorMessage })
    }
  }, [limit])

  return { ...state, refetch: fetchFeatured }
}

export function useProductsByCategory(category: string) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (category) {
      fetchByCategory()
    }
  }, [category])

  const fetchByCategory = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await getProductsByCategory(category)
      setState({ products: data, loading: false, error: null })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch products'
      setState({ products: [], loading: false, error: errorMessage })
    }
  }, [category])

  return { ...state, refetch: fetchByCategory }
}
