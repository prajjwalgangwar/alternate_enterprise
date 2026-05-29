'use client'

import { useContactForm } from '@/hooks/useContactForm'
import { SuccessMessage, ErrorDisplay } from './common'
import { motion } from 'framer-motion'
import { Timestamp } from 'firebase/firestore'

export function ContactForm() {
  const { loading, error, success, submitForm } = useContactForm()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await submitForm({
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      country: formData.get('country') as string,
      inquiryType: formData.get('inquiryType') as string,
      message: formData.get('message') as string,
      createdAt: Timestamp.now(),
    })

    if (!error) {
      e.currentTarget.reset()
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SuccessMessage show={success} message="Thank you! We'll be in touch shortly." />

      {error && <ErrorDisplay error={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent disabled:bg-gray-100"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent disabled:bg-gray-100"
            placeholder="Company name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent disabled:bg-gray-100"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent disabled:bg-gray-100"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent disabled:bg-gray-100"
            placeholder="Country"
          />
        </div>

        <div>
          <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
            Inquiry Type
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select type...</option>
            <option value="bulk_order">Bulk Order</option>
            <option value="partnership">Partnership</option>
            <option value="distribution">Distribution</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          disabled={loading}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent disabled:bg-gray-100"
          placeholder="Tell us about your inquiry..."
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-premium-gold text-premium-dark font-semibold py-3 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5 }}>
            Sending...
          </motion.span>
        ) : (
          'Send Inquiry'
        )}
      </motion.button>
    </motion.form>
  )
}
