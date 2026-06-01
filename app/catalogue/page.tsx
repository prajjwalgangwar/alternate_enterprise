import type { Metadata } from 'next'
import CatalogueClient from './CatalogueClient'

export const metadata: Metadata = {
  title: 'Catalogue — Alternate Enterprises',
  description:
    'Browse our premium tobacco catalogue: FCV, Burley, Country Blend & Zimbabwe Cured. Expertly sourced, rigorously tested, and ready for international B2B export.',
  openGraph: {
    title: 'Catalogue — Alternate Enterprises',
    description:
      'Explore premium tobacco products from Alternate Enterprises. B2B export catalogue.',
    url: 'https://alternateenterprises.com/catalogue',
    siteName: 'Alternate Enterprises',
    type: 'website',
  },
}

export default function CataloguePage() {
  return <CatalogueClient />
}
