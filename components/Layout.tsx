'use client'

import { motion } from 'framer-motion'

export function Header() {
  return (
    <motion.header
      className="bg-premium-dark text-white border-b border-premium-gold/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-premium-gold">ALTERNATE ENTERPRISES</h1>
          <p className="text-sm text-gray-400 mt-1">Premium Luxury Tobacco Exports</p>
        </motion.div>
      </div>
    </motion.header>
  )
}

export function Footer() {
  return (
    <motion.footer
      className="bg-premium-dark text-gray-400 border-t border-premium-gold/20 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-premium-gold font-bold mb-3">About</h3>
            <p className="text-sm">Premium luxury tobacco exports showcasing the finest selections from around the world.</p>
          </div>
          <div>
            <h3 className="text-premium-gold font-bold mb-3">Products</h3>
            <p className="text-sm">Curated selection of premium tobacco products with exceptional quality and heritage.</p>
          </div>
          <div>
            <h3 className="text-premium-gold font-bold mb-3">Contact</h3>
            <p className="text-sm">Reach out for bulk orders, partnerships, and distribution inquiries.</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-xs text-center text-gray-500">
            © 2026 Alternate Enterprises. All rights reserved. | Premium Luxury Tobacco Exports
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
