'use client'

import { useState } from 'react'
import { useContactForm } from '@/hooks/useContactForm'
import { SuccessMessage, ErrorDisplay } from './common'
import { motion } from 'framer-motion'

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China',
  'Colombia', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Egypt',
  'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hong Kong', 'Hungary',
  'India', 'Indonesia', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
  'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania',
  'Luxembourg', 'Malaysia', 'Malta', 'Mexico', 'Morocco', 'Myanmar',
  'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan',
  'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam', 'Zimbabwe',
]

const PRODUCTS = [
  'FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured',
  'Virginia Tobacco', 'Oriental Tobacco', 'Dark Air-Cured', 'Sun-Cured',
]

interface EnquiryFormProps {
  initialProducts?: string[]
}

export function EnquiryForm({ initialProducts }: EnquiryFormProps) {
  const { loading, error, success, submitForm } = useContactForm()
  const [selectedProducts, setSelectedProducts] = useState<string[]>(initialProducts || [])

  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    await submitForm({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      companyName: formData.get('companyName') as string,
      country: formData.get('country') as string,
      products: selectedProducts,
    })

    if (!error && !loading) {
      form.reset()
      setSelectedProducts([])
    }
  }

  const fieldClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white disabled:bg-gray-50 text-sm"
  const labelClass = "block text-xs uppercase tracking-[0.15em] font-semibold text-gray-600 mb-1.5"
  const requiredMark = <span className="text-gold ml-0.5">*</span>

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SuccessMessage show={success} message="Thank you! We'll review your enquiry and get back to you shortly." />

      {error && <ErrorDisplay error={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelClass}>First Name{requiredMark}</label>
          <input type="text" id="firstName" name="firstName" required disabled={loading} className={fieldClass} placeholder="John" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last Name{requiredMark}</label>
          <input type="text" id="lastName" name="lastName" required disabled={loading} className={fieldClass} placeholder="Doe" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone Number{requiredMark}</label>
          <input type="tel" id="phone" name="phone" required disabled={loading} className={fieldClass} placeholder="+1 (555) 000-0000" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email{requiredMark}</label>
          <input type="email" id="email" name="email" required disabled={loading} className={fieldClass} placeholder="john@company.com" />
        </div>
      </div>

      <div>
        <label htmlFor="companyName" className={labelClass}>Company Name{requiredMark}</label>
        <input type="text" id="companyName" name="companyName" required disabled={loading} className={fieldClass} placeholder="Company Ltd." />
      </div>

      <div>
        <label htmlFor="country" className={labelClass}>Select Country{requiredMark}</label>
        <select id="country" name="country" required disabled={loading} className={fieldClass}>
          <option value="">Select a country...</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <span className={labelClass}>Select Products{requiredMark}</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
          {PRODUCTS.map((product) => (
            <button
              key={product}
              type="button"
              onClick={() => toggleProduct(product)}
              disabled={loading}
              className={`text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-2.5 rounded-xl border transition-all ${
                selectedProducts.includes(product)
                  ? 'bg-gold text-charcoal border-gold'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gold/30'
              } disabled:opacity-50`}
            >
              {product}
            </button>
          ))}
        </div>
        {selectedProducts.length === 0 && (
          <p className="text-[10px] text-red-400 mt-1.5">Select at least one product</p>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 btn-gold text-sm py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}>
            Sending...
          </motion.span>
        ) : (
          <>
            Submit Enquiry
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </motion.button>
    </motion.form>
  )
}
