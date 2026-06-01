import type { Metadata } from 'next'
import TermsClient from './TermsClient'

export const metadata: Metadata = {
  title: 'Terms of Service — Alternate Enterprises',
  description:
    'Terms and conditions for using Alternate Enterprises website and B2B tobacco trade services.',
  openGraph: {
    title: 'Terms of Service — Alternate Enterprises',
    description: 'Terms and conditions for Alternate Enterprises B2B tobacco trade services.',
    url: 'https://alternateenterprises.com/terms',
    siteName: 'Alternate Enterprises',
    type: 'website',
  },
}

export default function TermsPage() {
  return <TermsClient />
}
