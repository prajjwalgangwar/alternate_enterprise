'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Collection', href: '/#featured' },
  { label: 'Contact', href: '/#contact' },
]

export function Header() {
  return (
    <>
      <div className="health-warning">
        Tobacco products are not a safe alternative to cigarettes. This site is for B2B trade professionals only.
      </div>
      <motion.header
        className="bg-premium-dark/90 backdrop-blur-md text-white border-b border-premium-gold/10 sticky top-0 z-50"
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
                  <Image src="/logo.png" alt="Alternate Enterprises" fill className="object-contain" />
                </div>
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.35em] text-premium-gold/50 mt-1">
                  Premium Tobacco Exports
                </span>
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-premium-gold transition-colors tracking-wider uppercase font-medium"
                >
                  {link.label}
                </a>
              ))}
              <motion.button
                className="btn-gold text-xs px-5 py-2 tracking-wider uppercase"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get a Quote
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>
    </>
  )
}

export function Footer() {
  return (
    <motion.footer
      className="bg-premium-dark text-gray-400 border-t border-premium-gold/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-premium-gold font-bold tracking-[0.15em] mb-4 text-lg">
              ALTERNATE ENTERPRISES
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Premium luxury tobacco exports showcasing the finest selections from around the world.
            </p>
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-4 font-semibold">Products</h4>
            <ul className="space-y-2.5 text-sm">
              {['FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured'].map((item) => (
                <li key={item}>
                  <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((item) => (
                <li key={item}>
                  <span className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-gray-500">info@alternateenterprises.com</li>
              <li className="text-gray-500">+1 (555) 000-0000</li>
            </ul>
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="space-y-4">
          <p className="text-[10px] text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            WARNING: These products are intended for use by adults 21 years or older.
            Tobacco products are not safe and are addictive. This website is intended
            for B2B trade professionals only. All products are for export purposes only.
          </p>
          <p className="text-xs text-center text-gray-600/80">
            &copy; {new Date().getFullYear()} Alternate Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
