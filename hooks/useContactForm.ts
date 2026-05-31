import { useCallback, useState } from 'react'
import { ContactInquiry, addContactInquiry } from '@/services/firestore/products'

interface UseContactFormState {
  loading: boolean
  error: string | null
  success: boolean
}

export function useContactForm() {
  const [state, setState] = useState<UseContactFormState>({
    loading: false,
    error: null,
    success: false,
  })

  const submitForm = useCallback(async (data: Omit<ContactInquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    setState({ loading: true, error: null, success: false })

    try {
      await addContactInquiry({ ...data, status: 'new' })
      setState({ loading: false, error: null, success: true })

      setTimeout(() => {
        setState((prev) => ({ ...prev, success: false }))
      }, 5000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to submit form'
      setState({ loading: false, error: errorMessage, success: false })
    }
  }, [])

  return {
    ...state,
    submitForm,
  }
}
