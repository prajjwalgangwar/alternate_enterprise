'use client'

import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { ContactForm } from '@/components/ContactForm'
import Link from 'next/link'
import { useSiteContent } from '@/context/SiteContent'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

export default function Home() {
  const { content } = useSiteContent()

  const stats = (Array.isArray(content.home_stats) ? content.home_stats : [
    '39+|Premium Varieties',
    '4|Growing Regions',
    '50+|Export Partners',
    '2024|Established',
  ]).map((s: string) => {
    const [value, label] = s.split('|')
    return { value, label }
  })

  const categories = (Array.isArray(content.home_categories_items) ? content.home_categories_items : [
    'FCV Tobacco|Bright, flue-cured Virginia with golden leaf and balanced sugar content.|Nicotine: 1.5-3.5% | Sugar: 12-20%',
    'Burley Tobacco|Air-cured with rich, full-bodied character and low sugar profile.|Nicotine: 2.0-4.0% | Sugar: 1-3%',
    'Country Blend|Artisanal blends combining the finest leaves for a distinctive profile.|Nicotine: 1.8-3.2% | Sugar: 8-15%',
    'Zimbabwe Cured|Premium African-cured tobacco with exceptional aroma and flavor.|Nicotine: 1.2-2.8% | Sugar: 14-22%',
  ]).map((s: string) => {
    const [title, desc, specs] = s.split('|')
    return { title, desc, specs }
  })

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        {(content.section_hero_visible as string) !== 'false' && content.home_hero_heading_1 && (
        <motion.section
          className="relative py-24 sm:py-28 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-premium-dark via-[#1a1208] to-[#0d0a04]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-tobacco-pattern opacity-[0.07]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-gold/40 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                className="inline-flex items-center gap-2 border border-premium-gold/20 rounded-full px-4 py-1.5 text-premium-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-premium-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                {content.home_hero_badge as string || 'Established 2024'}
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <span className="text-white/90">{content.home_hero_heading_1 as string || 'Premium'}</span>
                <br />
                <span className="text-gradient-gold">{content.home_hero_heading_2 as string || 'Tobacco'}</span>
                <br />
                <span className="text-white/90">{content.home_hero_heading_3 as string || 'Exports'}</span>
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base text-gray-400/80 mb-8 max-w-xl leading-relaxed font-light tracking-wide"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {content.home_hero_description as string || 'Sourcing the world&apos;s finest tobacco leaves since 2024. Expertly curated selections for discerning international trade partners.'}
              </motion.p>

              <motion.div
                className="flex items-center gap-4 flex-wrap"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Link
                  href="/catalogue"
                  className="relative inline-flex items-center gap-2 bg-gradient-to-r from-premium-gold to-amber-500 text-premium-dark font-bold text-sm px-7 py-3.5 rounded-full tracking-[0.15em] uppercase shadow-lg shadow-premium-gold/20 hover:shadow-premium-gold/40 hover:scale-[1.02] transition-all duration-300"
                >
                  {content.home_hero_cta_1 as string || 'Explore Collection'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border border-premium-gold/30 text-premium-gold text-sm px-7 py-3.5 rounded-full tracking-[0.15em] uppercase font-semibold hover:bg-premium-gold/10 hover:border-premium-gold/60 transition-all duration-300"
                >
                  {content.home_hero_cta_2 as string || 'Request a Quote'}
                </a>
              </motion.div>
            </div>
          </div>
        </motion.section>
        )}

        {/* Stats */}
        {(content.section_stats_visible as string) !== 'false' && stats.length > 0 && (
        <section className="bg-premium-dark border-y border-premium-gold/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-premium-gold">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Categories */}
        {(content.section_categories_visible as string) !== 'false' && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="mb-12">
            <span className="text-premium-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
              {content.home_categories_section_label as string || 'Our Selection'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-premium-dark mt-3 mb-3">
              {(content.home_categories_heading as string || 'Tobacco Categories').split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? <span key={i} className="text-gradient-gold">{word} </span> : <span key={i} className="text-premium-dark">{word} </span>
              )}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
              {content.home_categories_description as string || 'From bright Virginia to rich Burley, each variety is selected for its exceptional quality'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.title}
                className="bg-white rounded-xl p-6 border border-tobacco-100 hover:border-premium-gold/30 transition-all duration-300 shadow-sm hover:shadow-md"
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <h3 className="text-base font-bold text-premium-dark mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{cat.desc}</p>
                <div className="divider-gold my-2.5" />
                <p className="text-[10px] text-premium-gold font-medium tracking-wider uppercase">{cat.specs}</p>
              </motion.div>
            ))}
          </div>
        </section>
        )}

        {/* Featured Products */}
        {(content.section_featured_visible as string) !== 'false' && content.home_featured_heading && (
        <section id="featured" className="bg-premium-dark text-white py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-tobacco-pattern opacity-5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="text-premium-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
                {content.home_featured_section_label as string || 'Featured Selection'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-3">
                {(content.home_featured_heading as string || 'Premium Collection').split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? <span key={i} className="text-gradient-gold">{word} </span> : <span key={i} className="text-white">{word} </span>
                )}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                {content.home_featured_description as string || 'Our curated selection of the finest tobacco products available for export.'}
              </p>
            </motion.div>
            <FeaturedProducts />
          </div>
        </section>
        )}

        {/* Contact */}
        {(content.section_contact_visible as string) !== 'false' && content.home_contact_heading && (
        <section id="contact" className="bg-gradient-to-b from-tobacco-50 to-cream py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-premium-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
                {content.home_contact_section_label as string || 'Connect'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-premium-dark mt-3 mb-3">
                {(content.home_contact_heading as string || 'Get In Touch').split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? <span key={i} className="text-gradient-gold">{word}</span> : <span key={i}>{word} </span>
                )}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
                {content.home_contact_description as string || 'Interested in bulk orders, partnerships, or distribution? Contact us with your inquiry.'}
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
        )}

        {/* Health Warning */}
        {(content.section_health_warning_visible as string) !== 'false' && content.home_health_warning && (
        <section className="bg-premium-dark border-t border-premium-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
              {content.home_health_warning as string || 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.'}
            </p>
          </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
