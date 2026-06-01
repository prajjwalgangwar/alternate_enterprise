'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { EnquiryForm } from '@/components/EnquiryForm'
import { getProductById, getProducts, Product } from '@/services/firestore/products'
import { SkeletonLoader } from '@/components/common'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [failedImage, setFailedImage] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [single, all] = await Promise.all([
        getProductById(productId),
        getProducts(),
      ])
      if (!cancelled) {
        setProduct(single)
        setAllProducts(all)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [productId])

  const index = product ? allProducts.findIndex((p) => p.productId === product.productId) : -1
  const prev = index > 0 ? allProducts[index - 1] : null
  const next = index < allProducts.length - 1 ? allProducts[index + 1] : null

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <SkeletonLoader count={1} className="w-full max-w-4xl px-4" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-tobacco-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-tobacco-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-charcoal mb-2">Product Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/catalogue" className="btn-gold text-sm px-6 py-2.5 rounded-xl font-semibold">
            Browse Catalogue
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const primaryImage = product.imageUrls?.[0] ?? product.imageUrl

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="bg-white border-b border-tobacco-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Link href="/catalogue" className="hover:text-primary-light transition-colors">Catalogue</Link>
              {product.category && <><span>/</span><span className="text-charcoal font-medium">{product.category}</span></>}
              <span>/</span>
              <span className="text-charcoal">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Product Detail */}
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Image column */}
              <div className="relative">
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-tobacco-950 to-premium-dark"
                >
                  {failedImage || !primaryImage ? (
                    <div className="flex items-center justify-center h-full p-12">
                      <Image src="/logo.png" alt="Alternate Enterprises" width={160} height={80} className="object-contain opacity-30" />
                    </div>
                  ) : (
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={() => setFailedImage(true)}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-bold bg-gold/20 text-gold border border-gold/30 backdrop-blur-sm rounded-lg">
                      {product.grade}
                    </span>
                  </div>

                  {/* Overlay specs when form is shown */}
                  <AnimatePresence>
                    {showForm && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 backdrop-blur-[2px] flex flex-col justify-end p-6 sm:p-8"
                      >
                        <motion.span
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold mb-2"
                        >
                          {product.category}
                        </motion.span>
                        <motion.h2
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.15, duration: 0.3 }}
                          className="text-xl sm:text-2xl font-bold text-white leading-tight mb-3"
                        >
                          {product.name}
                        </motion.h2>
                        <motion.p
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-2"
                        >
                          {product.description}
                        </motion.p>
                        <motion.div
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.25, duration: 0.3 }}
                          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                        >
                          {([
                            { label: 'Nico', value: product.nicotine },
                            { label: 'Sugar', value: product.sugar },
                            { label: 'Body', value: product.body },
                            { label: 'Color', value: product.color },
                          ]).map((spec) => (
                            <div key={spec.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center">
                              <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">{spec.label}</p>
                              <p className="text-xs font-bold text-white">{spec.value}</p>
                            </div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Right column - details or form */}
              <div className="flex flex-col justify-start">
                <AnimatePresence mode="wait">
                  {!showForm ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold mb-3 inline-block">
                        {product.category}
                      </span>
                      <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight mb-4">
                        {product.name}
                      </h1>
                      <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        {product.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {([
                          { label: 'Nicotine', value: product.nicotine },
                          { label: 'Sugar', value: product.sugar },
                          { label: 'Body', value: product.body },
                          { label: 'Color', value: product.color },
                        ]).map((spec) => (
                          <div key={spec.label} className="bg-white rounded-xl border border-tobacco-100 p-4 text-center">
                            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 mb-1">
                              {spec.label}
                            </p>
                            <p className="text-sm font-bold text-charcoal">
                              {spec.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-premium-dark/5 border border-gold/10 rounded-xl px-5 py-4 mb-8">
                        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-500 mb-1">Grade</p>
                        <p className="text-sm font-semibold text-charcoal">{product.grade}</p>
                      </div>

                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full inline-flex items-center justify-center gap-2 btn-gold text-sm py-3.5 rounded-xl font-bold cursor-pointer"
                      >
                        Enquire About This Product
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-charcoal">Enquire About {product.name}</h3>
                        <button
                          onClick={() => setShowForm(false)}
                          className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-charcoal transition-colors font-semibold"
                        >
                          &larr; Back to Details
                        </button>
                      </div>
                      <EnquiryForm initialProducts={[product.name]} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Prev / Next Navigation */}
        {(prev || next) && (
          <section className="border-t border-tobacco-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  {prev && (
                    <Link
                      href={`/catalogue/${prev.productId}`}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-light transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">{prev.name}</span>
                      <span className="sm:hidden">Previous</span>
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  {next && (
                    <Link
                      href={`/catalogue/${next.productId}`}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-light transition-colors"
                    >
                      <span className="hidden sm:inline">{next.name}</span>
                      <span className="sm:hidden">Next</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Health Warning */}
        <section className="bg-premium-dark border-t border-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
              SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
