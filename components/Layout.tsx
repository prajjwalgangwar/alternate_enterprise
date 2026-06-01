'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSiteContent } from '@/context/SiteContent'

export function Header() {
  const { content } = useSiteContent()
  const [offeringsOpen, setOfferingsOpen] = useState(false)

  const categories = (Array.isArray(content.catalogue_categories)
    ? content.catalogue_categories
    : ['All', 'FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured']
  ).filter((c) => c !== 'All')

  const navLinks = [
    { label: content.nav_home as string, href: '/' },
    { label: content.nav_offerings as string, href: '/catalogue' },
    { label: content.nav_contact as string, href: '/contact' },
  ].filter((l) => l.label)

  return (
    <>
      {(content.section_header_banner_visible as string) !== 'false' && content.header_health_warning && (
        <div className="health-warning">
          {content.header_health_warning as string}
        </div>
      )}
      <motion.header
        className="bg-premium-dark/90 backdrop-blur-md text-white border-b border-gold/10 sticky top-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3.5">
            <Link href="/">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="relative w-9 h-9">
                  <Image src="/logo.png" alt={content.header_logo_alt as string || 'Alternate Enterprises'} width={36} height={36} className="object-contain" priority />
                </div>
                {!!(content.header_tagline as string) && (
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.35em] text-gold/50 mt-1">
                  {content.header_tagline as string}
                </span>
                )}
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.label === content.nav_offerings ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOfferingsOpen(true)}
                    onMouseLeave={() => setOfferingsOpen(false)}
                  >
                    <a
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-primary-light transition-colors tracking-wider uppercase font-medium px-3 py-1.5 hover:bg-white/5 rounded-lg"
                    >
                      {link.label}
                    </a>
                    <AnimatePresence>
                      {offeringsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-premium-dark border border-gold/10 rounded-xl shadow-2xl overflow-hidden"
                        >
                          {categories.map((cat) => (
                            <Link
                              key={cat}
                              href={`/catalogue?category=${encodeURIComponent(cat)}`}
                              className="block px-5 py-3 text-xs uppercase tracking-[0.15em] text-gray-300 hover:text-primary-light hover:bg-white/5 transition-all"
                            >
                              {cat}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-primary-light transition-colors tracking-wider uppercase font-medium px-3 py-1.5 hover:bg-white/5 rounded-lg"
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>
      </motion.header>
    </>
  )
}

export function Footer() {
  const { content } = useSiteContent()

  const productList = Array.isArray(content.footer_product_list)
    ? content.footer_product_list
    : ['FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured']

  const quickLinkRoutes: Record<string, string> = {
    'About Us': '/about',
    'Privacy Policy': '/privacy',
    'Terms of Service': '/terms',
    'FAQ': '/faq',
  }

  const quickLinks = Array.isArray(content.footer_quick_links)
    ? content.footer_quick_links
    : ['About Us', 'Privacy Policy', 'Terms of Service', 'FAQ']

  return (
    <>
      {(content.section_footer_visible as string) !== 'false' && (
        <motion.footer
      className="bg-premium-dark text-gray-400 border-t border-gold/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            {!!(content.footer_company_name as string) && (
            <h3 className="text-gold font-bold tracking-[0.15em] mb-4 text-lg">
              {content.footer_company_name as string}
            </h3>
            )}
            {!!(content.footer_description as string) && (
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {content.footer_description as string}
            </p>
            )}
          </div>
          <div>
            {!!(content.footer_products_heading as string) && (
            <h4 className="text-white/80 text-sm mb-4 font-semibold">{content.footer_products_heading as string}</h4>
            )}
            {productList.length > 0 && (
            <ul className="space-y-2.5 text-sm">
              {productList.map((item) => (
                <li key={item}>
                  <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
            )}
          </div>
          <div>
            {!!(content.footer_quick_links_heading as string) && (
            <h4 className="text-white/80 text-sm mb-4 font-semibold">{content.footer_quick_links_heading as string}</h4>
            )}
            {quickLinks.length > 0 && (
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item}>
                  <Link href={quickLinkRoutes[item] || '/'} className="text-gray-500 hover:text-gray-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            )}
          </div>
          <div>
            {!!(content.footer_contact_heading as string) && (
            <h4 className="text-white/80 text-sm mb-4 font-semibold">{content.footer_contact_heading as string}</h4>
            )}
            <ul className="space-y-2.5 text-sm">
              {!!(content.footer_email as string) && <li className="text-gray-500">{content.footer_email as string}</li>}
              {!!(content.footer_phone as string) && <li className="text-gray-500">{content.footer_phone as string}</li>}
            </ul>
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="space-y-4">
          {!!(content.footer_health_warning as string) && (
          <p className="text-[10px] text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            {content.footer_health_warning as string}
          </p>
          )}
          {!!(content.footer_copyright as string) && (
          <p className="text-xs text-center text-gray-600/80">
            &copy; {new Date().getFullYear()} {content.footer_copyright as string}
          </p>
          )}
        </div>
      </div>
    </motion.footer>
      )}
    </>
  )
}
