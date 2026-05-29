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

const categories = [
  {
    title: 'FCV Tobacco',
    description: 'Bright, flue-cured Virginia with golden leaf and balanced sugar content.',
    specs: 'Nicotine: 1.5-3.5% | Sugar: 12-20%',
  },
  {
    title: 'Burley Tobacco',
    description: 'Air-cured with rich, full-bodied character and low sugar profile.',
    specs: 'Nicotine: 2.0-4.0% | Sugar: 1-3%',
  },
  {
    title: 'Country Blend',
    description: 'Artisanal blends combining the finest leaves for a distinctive profile.',
    specs: 'Nicotine: 1.8-3.2% | Sugar: 8-15%',
  },
  {
    title: 'Zimbabwe Cured',
    description: 'Premium African-cured tobacco with exceptional aroma and flavor.',
    specs: 'Nicotine: 1.2-2.8% | Sugar: 14-22%',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-premium-light">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          className="gradient-warm text-white py-24 sm:py-36 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-tobacco-pattern opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-premium-dark/40" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="inline-block border border-premium-gold/30 rounded-full px-5 py-1.5 text-premium-gold text-xs uppercase tracking-[0.25em] mb-6"
                variants={itemVariants}
              >
                Established 2024
              </motion.div>
              <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight" variants={itemVariants}>
                Premium Luxury{' '}
                <span className="text-gradient-gold">Tobacco Exports</span>
              </motion.h1>
              <motion.p className="text-base sm:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed" variants={itemVariants}>
                Sourcing the world&apos;s finest tobacco leaves since 2024.
                Expertly curated selections for discerning international trade partners.
              </motion.p>
              <motion.div className="flex items-center justify-center gap-4 flex-wrap" variants={itemVariants}>
                <motion.a
                  href="#featured"
                  className="btn-gold text-sm px-8 py-3"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore Collection
                </motion.a>
                <motion.a
                  href="#contact"
                  className="btn-outline-gold text-sm px-8 py-3"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Request a Quote
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="text-center mb-14" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.span className="text-premium-gold text-xs uppercase tracking-[0.25em] font-semibold" variants={itemVariants}>
              Our Selection
            </motion.span>
            <motion.h2 className="text-3xl sm:text-4xl font-bold text-premium-dark mt-3 mb-4" variants={itemVariants}>
              Tobacco <span className="text-gradient-gold">Categories</span>
            </motion.h2>
            <motion.p className="text-gray-500 text-lg max-w-2xl mx-auto" variants={itemVariants}>
              From bright Virginia to rich Burley, each variety is selected for its exceptional quality
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.title}
                className="card-premium p-6 text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-premium-gold/20 to-premium-gold/5 flex items-center justify-center mx-auto mb-4 group-hover:from-premium-gold/30 group-hover:to-premium-gold/10 transition-all">
                  <span className="text-premium-gold text-lg font-bold">{cat.title[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-premium-dark mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{cat.description}</p>
                <p className="text-[11px] text-premium-gold font-medium">{cat.specs}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section
          id="featured"
          className="bg-charcoal text-white py-20 sm:py-28 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="absolute inset-0 bg-tobacco-pattern opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-14" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.span className="text-premium-gold text-xs uppercase tracking-[0.25em] font-semibold" variants={itemVariants}>
                Featured
              </motion.span>
              <motion.h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4" variants={itemVariants}>
                Premium <span className="text-gradient-gold">Collection</span>
              </motion.h2>
              <motion.p className="text-gray-400 text-lg max-w-2xl mx-auto" variants={itemVariants}>
                Our curated selection of the finest tobacco products available for export
              </motion.p>
            </motion.div>
            <FeaturedProducts />
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="bg-gradient-to-b from-premium-light to-tobacco-50 py-20 sm:py-28"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.span className="text-premium-gold text-xs uppercase tracking-[0.25em] font-semibold" variants={itemVariants}>
                Connect
              </motion.span>
              <motion.h2 className="text-3xl sm:text-4xl font-bold text-premium-dark mt-3 mb-4" variants={itemVariants}>
                Get In <span className="text-gradient-gold">Touch</span>
              </motion.h2>
              <motion.p className="text-gray-500 text-lg max-w-2xl mx-auto" variants={itemVariants}>
                Interested in bulk orders, partnerships, or distribution?
                Contact us with your inquiry.
              </motion.p>
            </motion.div>
            <ContactForm />
          </div>
        </motion.section>

        {/* Bottom Health Warning */}
        <section className="bg-premium-dark border-t border-premium-gold/10">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <div className="w-8 h-px bg-premium-gold/40 mx-auto mb-4" />
            <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-wider">
              SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease,
              emphysema, and complications during pregnancy. This site is for B2B
              trade professionals only. Must be 21+ to access.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
