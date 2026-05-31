'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { EnquiryForm } from '@/components/EnquiryForm'
import { useProducts } from '@/hooks/useProducts'
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
  const { products } = useProducts()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [sidebarHeight, setSidebarHeight] = useState(0)

  useEffect(() => {
    const el = sidebarRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSidebarHeight(entry.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  }, [activeCategory])

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

  const categoryProducts = useMemo(() => {
    if (!activeCategory) return []
    return products.filter((p) => p.category === activeCategory)
  }, [products, activeCategory])

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
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(199,154,59,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-tobacco-pattern opacity-[0.07]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              {!!(content.home_hero_badge as string) && (
              <motion.div
                className="inline-flex items-center gap-2 border border-gold/20 rounded-full px-4 py-1.5 text-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-6"

                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(199,154,59,0.6)]" />
                {content.home_hero_badge as string}
              </motion.div>
              )}

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {!!(content.home_hero_heading_1 as string) && (
                  <><span className="text-white/90">{content.home_hero_heading_1 as string}</span><br /></>
                )}
                {!!(content.home_hero_heading_2 as string) && (
                  <><span className="text-gradient-gold">{content.home_hero_heading_2 as string}</span><br /></>
                )}
                {!!(content.home_hero_heading_3 as string) && (
                  <span className="text-white/90">{content.home_hero_heading_3 as string}</span>
                )}
              </motion.h1>

              {!!(content.home_hero_description as string) && (
              <motion.p
                className="text-sm sm:text-base text-gray-400/80 mb-8 max-w-xl leading-relaxed font-light tracking-wide"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {content.home_hero_description as string}
              </motion.p>
              )}

              <motion.div
                className="flex items-center gap-4 flex-wrap"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {!!(content.home_hero_cta_1 as string) && (
                <Link
                  href="/catalogue"
                  className="relative inline-flex items-center gap-2 bg-gradient-to-r from-gold to-amber-500 text-charcoal font-bold text-sm px-7 py-3.5 rounded-full tracking-[0.15em] uppercase shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.02] transition-all duration-300"
                >
                  {content.home_hero_cta_1 as string}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                )}
                {!!(content.home_hero_cta_2 as string) && (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border border-gold/30 text-gold text-sm px-7 py-3.5 rounded-full tracking-[0.15em] uppercase font-semibold hover:bg-gold/10 hover:border-gold/60 transition-all duration-300"
                >
                  {content.home_hero_cta_2 as string}
                </a>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>
        )}

        {/* Stats */}
        {(content.section_stats_visible as string) !== 'false' && stats.length > 0 && (
        <section className="bg-premium-dark border-y border-gold/5">
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
                  <p className="text-2xl sm:text-3xl font-bold text-gold">{stat.value}</p>
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
            {!!(content.home_categories_section_label as string) && (
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
              {content.home_categories_section_label as string}
            </span>
            )}
            {!!(content.home_categories_heading as string) && (
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mt-3 mb-3">
              {(content.home_categories_heading as string).split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? <span key={i} className="text-gradient-gold">{word} </span> : <span key={i} className="text-charcoal">{word} </span>
              )}
            </h2>
            )}
            {!!(content.home_categories_description as string) && (
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
              {content.home_categories_description as string}
            </p>
            )}
          </div>

          {activeCategory ? (
            <div className="flex gap-6 items-start">
              <div ref={sidebarRef} className="w-full max-w-[280px] shrink-0 space-y-3">
                {categories.map((cat, index) => {
                  const isActive = activeCategory === cat.title
                  return (
                    <motion.div
                      key={cat.title}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      onClick={() => setActiveCategory(isActive ? null : cat.title)}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-300 border relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-gold/5 to-white border-gold/30 shadow-md shadow-gold/5'
                          : 'bg-white/80 border-tobacco-100 hover:border-gold/20 hover:shadow-sm'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gold to-gold/60 rounded-r" />}
                      <p className={`text-xs font-bold truncate transition-colors ${isActive ? 'text-gold' : 'text-charcoal'}`}>{cat.title}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{cat.desc}</p>
                      <div className="divider-gold my-2" />
                      <p className={`text-[9px] font-medium tracking-wider uppercase ${isActive ? 'text-gold' : 'text-gold'}`}>{cat.specs}</p>
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex-1 min-w-0">
                {categoryProducts.length > 0 ? (
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex gap-3 overflow-x-auto pb-1 scrollbar-premium"
                  >
                    {categoryProducts.map((p, i) => (
                      <motion.div
                        key={p.productId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="shrink-0"
                      >
                        <Link
                          href={`/catalogue/${p.productId}`}
                          className="group flex flex-col bg-white border border-tobacco-100 rounded-xl overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-300 min-w-[180px] max-w-[200px]"
                          style={{ height: sidebarHeight || 264 }}
                        >
                          {p.imageUrl && (
                            <div className="h-0 min-h-[60%] overflow-hidden bg-[#e2e2dd] relative">
                              <div className={`absolute inset-0 bg-gradient-to-r from-[#d4d4cf] via-[#eaeae5] to-[#d4d4cf] bg-[length:200%_100%] animate-shimmer ${loadedImages.has(p.productId) ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                onLoad={() => setLoadedImages(prev => new Set(prev).add(p.productId))}
                                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 relative z-10 ${loadedImages.has(p.productId) ? 'opacity-100' : 'opacity-0'}`}
                              />
                            </div>
                          )}
                          <div className="flex flex-col flex-1 px-5 py-4">
                            <p className="text-sm font-bold text-charcoal group-hover:text-gold transition-colors truncate">{p.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-widest">{p.grade}</p>
                            {p.description && <p className="text-[10px] text-gray-500 leading-relaxed mt-1.5 line-clamp-2">{p.description}</p>}
                            <div className="mt-auto">
                              <div className="divider-gold my-3" />
                              <div className="flex gap-4 text-[10px] text-gray-500">
                                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gold/70" />N {p.nicotine}</span>
                                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gold/70" />S {p.sugar}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white border border-tobacco-100 rounded-xl p-8 text-center"
                  >
                    <p className="text-sm text-gray-400">No products in <span className="font-semibold text-charcoal">{activeCategory}</span> yet.</p>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.title}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  onClick={() => setActiveCategory(cat.title)}
                  className="group bg-white border border-tobacco-100 hover:border-gold/30 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-base font-bold text-charcoal group-hover:text-gold transition-colors mb-2">{cat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{cat.desc}</p>
                  <div className="divider-gold my-2.5" />
                  <p className="text-[10px] text-gold font-medium tracking-wider uppercase">{cat.specs}</p>
                </motion.div>
              ))}
            </div>
          )}
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
              {!!(content.home_featured_section_label as string) && (
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
                {content.home_featured_section_label as string}
              </span>
              )}
              {!!(content.home_featured_heading as string) && (
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-3">
                {(content.home_featured_heading as string).split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? <span key={i} className="text-gradient-gold">{word} </span> : <span key={i} className="text-white">{word} </span>
                )}
              </h2>
              )}
              {!!(content.home_featured_description as string) && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                {content.home_featured_description as string}
              </p>
              )}
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
              {!!(content.home_contact_section_label as string) && (
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
                {content.home_contact_section_label as string}
              </span>
              )}
              {!!(content.home_contact_heading as string) && (
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mt-3 mb-3">
                {(content.home_contact_heading as string).split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? <span key={i} className="text-gradient-gold">{word}</span> : <span key={i}>{word} </span>
                )}
              </h2>
              )}
              {!!(content.home_contact_description as string) && (
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
                {content.home_contact_description as string}
              </p>
              )}
            </div>
            <EnquiryForm />
          </div>
        </section>
        )}

        {/* Health Warning */}
        {(content.section_health_warning_visible as string) !== 'false' && content.home_health_warning && (
        <section className="bg-premium-dark border-t border-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
              {content.home_health_warning as string}
            </p>
          </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
