import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact — Alternate Enterprises',
  description:
    'Contact Alternate Enterprises for bulk tobacco orders, B2B partnerships, and distribution inquiries. Reach our global trade team within 24 hours.',
  openGraph: {
    title: 'Contact — Alternate Enterprises',
    description:
      'Get in touch with Alternate Enterprises for premium tobacco export inquiries. B2B trade only.',
    url: 'https://alternateenterprises.com/contact',
    siteName: 'Alternate Enterprises',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
