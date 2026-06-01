import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Alternate Enterprises — Premium Luxury Tobacco Exports',
  description:
    'Alternate Enterprises: Premium luxury tobacco exports since 2024. Expertly curated FCV, Burley, Country Blend & Zimbabwe Cured tobacco for discerning international trade partners.',
  openGraph: {
    title: 'Alternate Enterprises — Premium Luxury Tobacco Exports',
    description:
      'Premium luxury tobacco products from Alternate Enterprises. Sourcing the world\'s finest tobacco leaves for B2B partners worldwide.',
    url: 'https://alternateenterprises.com',
    siteName: 'Alternate Enterprises',
    type: 'website',
  },
}

export default function HomePage() {
  return <HomeClient />
}
