import type { Metadata } from 'next'
import FaqClient from './FaqClient'

export const metadata: Metadata = {
  title: 'FAQ — Alternate Enterprises',
  description:
    'Frequently asked questions about Alternate Enterprises premium tobacco products, B2B ordering, shipping, and quality control.',
  openGraph: {
    title: 'FAQ — Alternate Enterprises',
    description: 'FAQ about Alternate Enterprises premium tobacco export services.',
    url: 'https://alternateenterprises.com/faq',
    siteName: 'Alternate Enterprises',
    type: 'website',
  },
}

export default function FaqPage() {
  return <FaqClient />
}
