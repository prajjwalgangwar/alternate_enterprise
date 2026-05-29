'use client'

import { useFeaturedProducts } from '@/hooks/useProducts'
import { SkeletonLoader, ErrorDisplay } from './common'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts(6)

  if (loading) {
    return <SkeletonLoader count={3} />
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
          className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="relative w-full h-64 bg-gray-200">
            {primaryImage && (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
                priority={index < 3}
              />
            )}
          </div>

          <div className="p-4">
            <span className="text-xs font-semibold text-premium-gold uppercase tracking-wide">
              {product.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div>
                <span className="text-gray-500">Nicotine:</span>
                <p className="font-semibold">{product.nicotine}</p>
              </div>
              <div>
                <span className="text-gray-500">Sugar:</span>
                <p className="font-semibold">{product.sugar}</p>
              </div>
              <div>
                <span className="text-gray-500">Body:</span>
                <p className="font-semibold">{product.body}</p>
              </div>
              <div>
                <span className="text-gray-500">Grade:</span>
                <p className="font-semibold text-premium-gold">{product.grade}</p>
              </div>
            </div>

            <motion.button
              className="w-full mt-4 bg-premium-gold text-premium-dark font-semibold py-2 rounded hover:bg-yellow-500 transition-colors"
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
