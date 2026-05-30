'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { getSiteContent, updateSiteContent as saveSiteContent, SiteContent } from '@/services/firestore/siteContent'

interface SiteContentContextValue {
  content: SiteContent
  loading: boolean
  updateContent: (updates: Partial<SiteContent>) => Promise<void>
  refresh: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

export function SiteContentProvider({ children, initialContent }: { children: ReactNode; initialContent?: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent ?? {})
  const [loading, setLoading] = useState(!initialContent)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getSiteContent()
      setContent(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialContent) {
      refresh()
    }
  }, [initialContent, refresh])

  const update = useCallback(async (updates: Partial<SiteContent>) => {
    await saveSiteContent(updates)
    setContent((prev) => ({ ...prev, ...updates } as SiteContent))
  }, [saveSiteContent])

  return (
    <SiteContentContext.Provider value={{ content, loading, updateContent: update, refresh }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) {
    throw new Error('useSiteContent must be used within a SiteContentProvider')
  }
  return ctx
}
