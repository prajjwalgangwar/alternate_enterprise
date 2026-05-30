'use client'

import { ReactNode } from 'react'
import { SiteContentProvider } from '@/context/SiteContent'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <SiteContentProvider>{children}</SiteContentProvider>
}
