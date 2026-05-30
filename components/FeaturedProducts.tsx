'use client'

import { useFeaturedProducts } from '@/hooks/useProducts'
import { SkeletonLoader, ErrorDisplay } from './common'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts(6)

  if (loading) {
    return <SkeletonLoader count={3} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {products.map((product, index) => {
        const primaryImage = product.imageUrls?.[0] ?? product.imageUrl

        return (
          <motion.div
            key={product.productId}
            className="bg-white/[0.04] backdrop-blur-sm border border-premium-gold/[0.08] rounded-xl overflow-hidden hover:border-premium-gold/25 transition-all duration-300 group"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <div className="relative w-full h-52 bg-gradient-to-br from-tobacco-950 to-premium-dark overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={index < 3}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-5xl font-bold text-premium-gold/10 tracking-widest">AE</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="tobacco-badge bg-premium-gold/20 text-premium-gold border border-premium-gold/30 backdrop-blur-sm">
                  {product.grade}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-base font-bold text-white leading-tight">{product.name}</h3>
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                {product.description}
              </p>

              <div className="divider-gold my-2.5" />

              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-[10px] text-gray-500">
                  <span>N: <strong className="text-gray-300">{product.nicotine}</strong></span>
                  <span>S: <strong className="text-gray-300">{product.sugar}</strong></span>
                  <span>B: <strong className="text-gray-300">{product.body}</strong></span>
                </div>
                <Link
                  href="/catalogue"
                  className="text-[10px] font-semibold text-premium-gold hover:text-amber-400 uppercase tracking-wider transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
