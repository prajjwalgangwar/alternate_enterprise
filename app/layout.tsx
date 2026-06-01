import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import AgeGate from '@/components/AgeGate'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Alternate Enterprises',
  url: 'https://alternateenterprises.com',
  description:
    'Premium luxury tobacco exports. Sourcing the world\'s finest FCV, Burley, Country Blend & Zimbabwe Cured tobacco leaves for B2B partners worldwide.',
  foundingDate: '2024',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@alternateenterprises.com',
    contactType: 'sales',
  },
}

export const metadata: Metadata = {
  title: 'Alternate Enterprises — Premium Luxury Tobacco Exports',
  description:
    'Alternate Enterprises: Premium luxury tobacco exports since 2024. Expertly curated FCV, Burley, Country Blend & Zimbabwe Cured tobacco leaves for international trade partners.',
  keywords: [
    'tobacco', 'luxury tobacco', 'premium tobacco exports', 'tobacco leaf supplier',
    'Alternate Enterprises', 'FCV tobacco', 'Burley tobacco', 'tobacco manufacturer',
    'B2B tobacco', 'tobacco wholesale',
  ],
  openGraph: {
    title: 'Alternate Enterprises — Premium Luxury Tobacco Exports',
    description:
      'Premium luxury tobacco exports since 2024. Expertly curated selections for discerning international trade partners.',
    url: 'https://alternateenterprises.com',
    siteName: 'Alternate Enterprises',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>
          {children}
          <AgeGate />
        </ClientLayout>
      </body>
    </html>
  )
}
