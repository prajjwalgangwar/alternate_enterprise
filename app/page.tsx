'use client'

import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { ContactForm } from '@/components/ContactForm'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-premium-light">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          className="bg-gradient-to-br from-premium-dark via-premium-dark to-gray-900 text-white py-20 sm:py-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" variants={itemVariants}>
                Premium Luxury Tobacco Exports
              </motion.h1>
              <motion.p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto" variants={itemVariants}>
                Discover exquisitely crafted tobacco selections sourced from the world&apos;s finest producers. Elevate your experience with Alternate Enterprises.
              </motion.p>
              <motion.button
                className="bg-premium-gold text-premium-dark font-semibold py-3 px-8 rounded-lg hover:bg-yellow-500 transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Products
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="mb-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 className="text-3xl sm:text-4xl font-bold text-premium-dark mb-4" variants={itemVariants}>
              Featured Collection
            </motion.h2>
            <motion.p className="text-gray-600 text-lg" variants={itemVariants}>
              Our curated selection of premium tobacco products
            </motion.p>
          </motion.div>
          <FeaturedProducts />
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="bg-gray-50 py-16 sm:py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="mb-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.h2 className="text-3xl sm:text-4xl font-bold text-premium-dark mb-4" variants={itemVariants}>
                Get In Touch
              </motion.h2>
              <motion.p className="text-gray-600 text-lg mb-8" variants={itemVariants}>
                Interested in bulk orders, partnerships, or distribution? Contact us with your inquiry.
              </motion.p>
            </motion.div>
            <ContactForm />
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
