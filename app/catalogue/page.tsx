'use client'

            import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { useProducts } from '@/hooks/useProducts'
import { SkeletonLoader } from '@/components/common'
import Image from 'next/image'

const categories = ['All', 'FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured']

export default function CataloguePage() {
  const { products, loading, error } = useProducts()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

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

        {/* Filters */}
        <section className="bg-white border-b border-tobacco-100 sticky top-[73px] z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-premium-dark text-premium-gold'
                        : 'bg-tobacco-50 text-gray-500 hover:bg-tobacco-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-56">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
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
                  placeholder="Search products..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-tobacco-50 border border-tobacco-100 rounded-full focus:outline-none focus:ring-2 focus:ring-premium-gold/30 focus:border-premium-gold placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <SkeletonLoader count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" />
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-gray-500">Unable to load products at this time.</p>
                <p className="text-xs text-gray-400 mt-1">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">No products found for this category.</p>
              </div>
            ) : (
              Object.entries(groupedCategories).map(([category, categoryProducts]) => (
                <div key={category} className="mb-12 last:mb-0">
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-lg font-bold text-premium-dark">{category}</h2>
                    <div className="divider-gold mt-2" />
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryProducts.map((product, index) => {
                      const primaryImage = product.imageUrls?.[0] ?? product.imageUrl
                      const showPlaceholder = !primaryImage || failedImages.has(product.productId)
                      return (
                        <motion.div
                          key={product.productId}
                          className="bg-white rounded-xl border border-tobacco-100 hover:border-premium-gold/30 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md group"
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="relative w-full h-80 bg-gradient-to-br from-tobacco-950 to-premium-dark overflow-hidden">
                            {showPlaceholder ? (
                              <div className="flex items-center justify-center h-full p-8">
                                <Image src="/logo.png" alt="Alternate Enterprises" width={120} height={60} className="object-contain opacity-40" />
                              </div>
                            ) : (
                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={() => handleImageError(product.productId)}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                            <div className="absolute top-3 right-3">
                              <span className="tobacco-badge bg-premium-gold/20 text-premium-gold border border-premium-gold/30 backdrop-blur-sm">
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
                                  <p className="text-gray-500 uppercase tracking-wider">Nico</p>
                                  <p className="text-premium-dark font-semibold">{product.nicotine}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 uppercase tracking-wider">Sugar</p>
                                  <p className="text-premium-dark font-semibold">{product.sugar}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 uppercase tracking-wider">Body</p>
                                  <p className="text-premium-dark font-semibold">{product.body}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 uppercase tracking-wider">Color</p>
                                  <p className="text-premium-dark font-semibold">{product.color}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Health Warning */}
        <section className="bg-premium-dark border-t border-premium-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
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
