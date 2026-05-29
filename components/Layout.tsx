'use client'

import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Collection', href: '#featured' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  return (
    <>
      <div className="health-warning">
        WARNING: Tobacco products are not a safe alternative to cigarettes.
        This site is for B2B trade professionals only.
      </div>
      <motion.header
        className="bg-premium-dark/95 backdrop-blur-sm text-white border-b border-premium-gold/10 sticky top-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold tracking-widest">
                <span className="text-premium-gold">ALTERNATE</span>{' '}
                <span className="text-white font-light">ENTERPRISES</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-premium-gold/60 mt-0.5">
                Premium Tobacco Exports
              </p>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-premium-gold transition-colors tracking-wide uppercase"
                >
                  {link.label}
                </a>
              ))}
              <motion.button
                className="btn-gold text-sm px-5 py-2"
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
      className="bg-premium-dark text-gray-400 border-t border-premium-gold/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <h3 className="text-premium-gold font-bold tracking-wider mb-3">
              ALTERNATE ENTERPRISES
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium luxury tobacco exports showcasing the finest selections from around the world.
            </p>
          </div>
          <div>
            <h4 className="text-premium-gold font-semibold text-sm mb-3 uppercase tracking-wider">
              Products
            </h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">FCV Tobacco</span></li>
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">Burley Tobacco</span></li>
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">Country Blend</span></li>
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">Zimbabwe Cured</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-premium-gold font-semibold text-sm mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">About Us</span></li>
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">Terms of Service</span></li>
              <li><span className="text-gray-500 hover:text-gray-300 cursor-pointer">FAQ</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-premium-gold font-semibold text-sm mb-3 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500">info@alternateenterprises.com</li>
              <li className="text-gray-500">+1 (555) 000-0000</li>
            </ul>
          </div>
        </div>

        <div className="divider-gold my-6" />

        <div className="space-y-4">
          <p className="text-[10px] text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
            WARNING: These products are intended for use by adults 21 years or older.
            Tobacco products are not safe and are addictive. This website is intended
            for B2B trade professionals and does not sell directly to consumers.
            All products are for export purposes only.
          </p>

          <p className="text-xs text-center text-gray-600">
            &copy; {new Date().getFullYear()} Alternate Enterprises. All rights reserved. | Premium Luxury Tobacco Exports
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
