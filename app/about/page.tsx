import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About — Alternate Enterprises',
  description:
    'Learn about Alternate Enterprises — a premium luxury tobacco export company founded in 2024. We source the world\'s finest tobacco leaves from 12 growing regions for B2B partners worldwide.',
  openGraph: {
    title: 'About — Alternate Enterprises',
    description:
      'Alternate Enterprises: premium tobacco exports since 2024. Our story, mission, and values.',
    url: 'https://alternateenterprises.com/about',
    siteName: 'Alternate Enterprises',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
