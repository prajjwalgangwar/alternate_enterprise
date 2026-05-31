import { Timestamp } from 'firebase/firestore'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  count?: number
  className?: string
}

export function SkeletonLoader({ count = 3, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-white/5 backdrop-blur-sm border border-gold/10 rounded-lg h-96 shimmer"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

interface ErrorBoundaryProps {
  error: string | null
  onDismiss?: () => void
}

export function ErrorDisplay({ error, onDismiss }: ErrorBoundaryProps) {
  if (!error) return null

  return (
    <motion.div
      className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300 backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <p className="font-semibold text-sm">Error</p>
      <p className="text-sm mt-1 text-red-400">{error}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-sm mt-3 text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          Dismiss
        </button>
      )}
    </motion.div>
  )
}

interface SuccessMessageProps {
  message?: string
  show: boolean
}

export function SuccessMessage({
  message = 'Successfully submitted!',
  show,
}: SuccessMessageProps) {
  return (
    <motion.div
      className="fixed top-20 right-4 bg-green-900/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 text-green-300 shadow-xl z-50"
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={show ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: -20, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="font-semibold text-sm">{message}</p>
      </div>
    </motion.div>
  )
}

export function formatTimestamp(timestamp: Timestamp): string {
  return new Date(timestamp.toMillis()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
