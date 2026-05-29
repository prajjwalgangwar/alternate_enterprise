'use client'

import { useFeaturedProducts } from '@/hooks/useProducts'
import { SkeletonLoader, ErrorDisplay } from './common'
import { motion } from 'framer-motion'
import Image from 'next/image'

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
      transition={{ duration: 0.6 }}
    >
      {products.map((product, index) => {
        const primaryImage = product.imageUrls?.[0] ?? product.imageUrl
        return (
        <motion.div
          key={product.productId}
          className="bg-white/5 backdrop-blur-sm border border-premium-gold/10 rounded-lg overflow-hidden hover:border-premium-gold/30 transition-all group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="relative w-full h-56 bg-tobacco-950 overflow-hidden">
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
                <span className="text-premium-gold/20 text-6xl font-bold tracking-widest">AE</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {product.featured && (
              <div className="absolute top-3 right-3">
                <span className="tobacco-badge bg-premium-gold text-premium-dark">
                  Featured
                </span>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-premium-gold/80 uppercase tracking-[0.2em]">
                {product.category}
              </span>
              <span className="tobacco-badge bg-premium-gold/10 text-premium-gold border border-premium-gold/20">
                {product.grade}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>

            <div className="divider-gold my-3" />

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-premium-gold/60" />
                <span className="text-gray-500">Nicotine:</span>
                <span className="text-gray-200 font-medium">{product.nicotine}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-premium-gold/60" />
                <span className="text-gray-500">Sugar:</span>
                <span className="text-gray-200 font-medium">{product.sugar}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-premium-gold/60" />
                <span className="text-gray-500">Body:</span>
                <span className="text-gray-200 font-medium">{product.body}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-premium-gold/60" />
                <span className="text-gray-500">Color:</span>
                <span className="text-gray-200 font-medium">{product.color || '-'}</span>
              </div>
            </div>

            <motion.button
              className="w-full mt-5 btn-outline-gold text-sm py-2.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
          </div>
        </motion.div>
        )
      })}
    </motion.div>
  )
}
