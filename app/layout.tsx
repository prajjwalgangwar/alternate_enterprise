import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alternate Enterprises — Premium Luxury Tobacco Exports',
  description:
    'Discover premium luxury tobacco products from Alternate Enterprises. Expert crafted, globally sourced tobacco selections for discerning customers.',
  keywords: [
    'tobacco', 'luxury', 'premium', 'exports', 'tobacco products',
    'Alternate Enterprises', 'FCV', 'Burley', 'tobacco leaf',
  ],
  openGraph: {
    title: 'Alternate Enterprises — Premium Luxury Tobacco Exports',
    description:
      'Premium luxury tobacco products from Alternate Enterprises.',
    type: 'website',
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
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
