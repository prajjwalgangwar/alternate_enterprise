import type { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy — Alternate Enterprises',
  description:
    'Alternate Enterprises privacy policy. Learn how we collect, use, and safeguard your business information when you engage with our tobacco export services.',
  openGraph: {
    title: 'Privacy Policy — Alternate Enterprises',
    description: 'Alternate Enterprises privacy policy for B2B tobacco trade partners.',
    url: 'https://alternateenterprises.com/privacy',
    siteName: 'Alternate Enterprises',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
