'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '@/context/SiteContent'

function getVerified() {
  if (typeof window === 'undefined') return true
  return !!localStorage.getItem('age_verified')
}

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}

export default function AgeGate() {
  const verified = useSyncExternalStore(subscribe, getVerified, () => true)
  const { content, loading } = useSiteContent()
  const visible = (content.section_age_gate_visible as string) !== 'false'
  const [dismissed, setDismissed] = useState(false)
  const show = !dismissed && visible && !verified && !loading

  function handleYes() {
    localStorage.setItem('age_verified', 'true')
    setDismissed(true)
  }

  function handleNo() {
    const url = (content.age_gate_redirect_url as string) || 'https://google.com'
    window.location.href = url
  }

  const imageUrl = content.age_gate_image as string

  return show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[999] flex items-center justify-center"
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: imageUrl
                ? `url(${imageUrl})`
                : 'linear-gradient(135deg, #0A3A22 0%, #0F4D2E 40%, #166534 100%)',
            }}
          >
            {!imageUrl && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
            )}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg mx-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-b from-primary-dark/95 to-primary/95 backdrop-blur-xl shadow-2xl">
              {/* Decorative top line */}
              <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="px-8 py-10 sm:px-12 sm:py-14 text-center">
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                  {(content.age_gate_heading as string) || 'Age Verification'}
                </h1>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-sm mx-auto">
                  {(content.age_gate_description as string) || 'You must be 21 years or older to access this website. Please confirm your age to enter.'}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    onClick={handleYes}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3.5 bg-primary text-white text-sm font-bold rounded-xl tracking-wider uppercase hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    {(content.age_gate_yes_button as string) || 'I Am 21 or Older'}
                  </motion.button>
                  <motion.button
                    onClick={handleNo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3.5 border border-gray-700 text-gray-400 text-sm font-semibold rounded-xl tracking-wider uppercase hover:border-red-500/50 hover:text-red-400 transition-all"
                  >
                    {(content.age_gate_no_button as string) || 'I Am Under 21'}
                  </motion.button>
                </div>

                {/* Footer */}
                <p className="mt-8 text-[9px] text-gray-600 uppercase tracking-[0.2em]">
                  B2B Trade Professionals Only
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null
  }
