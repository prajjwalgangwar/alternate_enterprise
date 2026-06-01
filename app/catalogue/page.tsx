'use client'

import { Suspense, useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { useProducts } from '@/hooks/useProducts'
import { SkeletonLoader } from '@/components/common'
import Image from 'next/image'
import Link from 'next/link'
import { useSiteContent } from '@/context/SiteContent'
import { useSearchParams } from 'next/navigation'

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream"><div className="w-8 h-8 border-2 border-tobacco-300 border-t-gold rounded-full animate-spin" /></div>}>
      <CatalogueContent />
    </Suspense>
  )
}

function CatalogueContent() {
  const { products, loading, error } = useProducts()
  const { content } = useSiteContent()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  const categories = useMemo(() => {
    const raw = Array.isArray(content.catalogue_categories)
      ? content.catalogue_categories
      : ['All', 'FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured']
    return [...raw].sort((a, b) => {
      if (/^others?$/i.test(a)) return 1
      if (/^others?$/i.test(b)) return -1
      return 0
    })
  }, [content.catalogue_categories])

  const specNico = content.catalogue_spec_nico as string
  const specSugar = content.catalogue_spec_sugar as string
  const specBody = content.catalogue_spec_body as string
  const specColor = content.catalogue_spec_color as string

  const handleImageError = useCallback((productId: string) => {
    setFailedImages((prev) => new Set(prev).add(productId))
  }, [])

  const filtered = useMemo(() => {
    let result = products
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.grade.toLowerCase().includes(q)
      )
    }
    return result
  }, [products, activeCategory, searchQuery])

  const groupedCategories = useMemo(() => {
    const groups: Record<string, typeof products> = {}
    for (const p of filtered) {
      const cat = p.category || 'Other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(p)
    }
    return groups
  }, [filtered])

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1">

        {/* Category Navbar */}
        <section className="bg-premium-dark border-b border-gold/10 sticky top-[73px] z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-0 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-3.5 border-b-2 transition-all duration-200 ${
                    activeCategory === cat
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {/* Spacer */}
              <div className="flex-1" />
              {/* Search */}
              <div className="relative hidden sm:block w-48">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={content.catalogue_search_placeholder as string}
                  className="w-full pl-7 pr-3 py-2 text-[11px] bg-premium-dark/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-gray-300 placeholder:text-gray-600"
                />
              </div>
            </nav>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <SkeletonLoader count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" />
            ) : error ? (
              <div className="text-center py-16">
                {!!(content.catalogue_error_message as string) && <p className="text-gray-500">{content.catalogue_error_message as string}</p>}
                <p className="text-xs text-gray-400 mt-1">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                {!!(content.catalogue_empty_message as string) && <p className="text-gray-500">{content.catalogue_empty_message as string}</p>}
              </div>
            ) : (
              Object.entries(groupedCategories).sort(([a], [b]) => {
                const idxA = categories.indexOf(a)
                const idxB = categories.indexOf(b)
                if (idxA !== -1 && idxB !== -1) return idxA - idxB
                if (idxA !== -1) return -1
                if (idxB !== -1) return 1
                if (/^others?$/i.test(a)) return 1
                if (/^others?$/i.test(b)) return -1
                return 0
              }).map(([category, categoryProducts]) => (
                <div key={category} className="mb-12 last:mb-0">
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-lg font-bold text-charcoal">{category}</h2>
                    <div className="divider-gold mt-2" />
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryProducts.map((product, index) => {
                      const primaryImage = product.imageUrls?.[0] ?? product.imageUrl
                      const showPlaceholder = !primaryImage || failedImages.has(product.productId)
                      return (
                        <Link key={product.productId} href={`/catalogue/${product.productId}`}>
                          <motion.div
                          className="bg-white rounded-xl border border-tobacco-100 hover:border-gold/30 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer"
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="relative w-full h-80 bg-gradient-to-br from-tobacco-950 to-premium-dark overflow-hidden">
                            {showPlaceholder ? (
                              <div className="flex items-center justify-center h-full p-8">
                                <Image src="/logo.png" alt={content.header_logo_alt as string} width={120} height={60} className="object-contain opacity-40" />
                              </div>
                            ) : (
                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={() => handleImageError(product.productId)}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                            <div className="absolute top-3 right-3">
                              <span className="tobacco-badge bg-gold/20 text-gold border border-gold/30 backdrop-blur-sm">
                                {product.grade}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="text-sm font-bold text-white leading-tight">{product.name}</h3>
                            </div>
                          </div>

                          <div className="p-4">
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
                              {product.description}
                            </p>

                            <div className="divider-gold my-2" />

                            <div className="flex items-center justify-between mb-2">
                              <div className="grid grid-cols-4 gap-3 text-[10px] w-full">
                                <div className="text-center">
                                  <p className="text-gray-500 uppercase tracking-wider">{specNico}</p>
                                  <p className="text-charcoal font-semibold">{product.nicotine}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 uppercase tracking-wider">{specSugar}</p>
                                  <p className="text-charcoal font-semibold">{product.sugar}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 uppercase tracking-wider">{specBody}</p>
                                  <p className="text-charcoal font-semibold">{product.body}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 uppercase tracking-wider">{specColor}</p>
                                  <p className="text-charcoal font-semibold">{product.color}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          </motion.div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Health Warning */}
        {(content.section_health_warning_visible as string) !== 'false' && content.catalogue_health_warning && (
        <section className="bg-premium-dark border-t border-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
              {content.catalogue_health_warning as string}
            </p>
          </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
