import { Timestamp } from 'firebase/firestore'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  count?: number
  className?: string
}

export function SkeletonLoader({ count = 3, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-gray-200 rounded-lg h-64"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
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
      className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <p className="font-semibold">Error</p>
      <p className="text-sm mt-1">{error}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-sm mt-3 text-red-600 hover:text-red-800 font-medium"
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
      className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-semibold">{message}</p>
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
