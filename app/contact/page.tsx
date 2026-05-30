'use client'

import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { ContactForm } from '@/components/ContactForm'
import { useSiteContent } from '@/context/SiteContent'

export default function ContactPage() {
  const { content } = useSiteContent()

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        {(content.section_hero_visible as string) !== 'false' && (content.contact_hero_heading_1 as string) && (
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-premium-dark via-[#1a1208] to-[#0d0a04]" />
          <div className="absolute inset-0 bg-tobacco-pattern opacity-[0.07]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-gold/40 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 border border-premium-gold/20 rounded-full px-4 py-1.5 text-premium-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-premium-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
              {content.contact_hero_badge as string || 'Connect With Us'}
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="text-white/90">{content.contact_hero_heading_1 as string || 'Get In'}</span>{' '}
              <span className="text-gradient-gold">{content.contact_hero_heading_2 as string || 'Touch'}</span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base text-gray-400/80 max-w-xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {content.contact_hero_description as string || 'Interested in bulk orders, partnerships, or distribution? Send us your inquiry and our team will respond within 24 hours.'}
            </motion.p>
          </div>
        </section>
        )}

        {/* Contact Form */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-premium-dark mb-4">
                  {content.contact_section_heading as string || 'Let\u2019s Start a Conversation'}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  {content.contact_section_description as string || 'Whether you\u2019re looking to place a bulk order, explore partnership opportunities, or discuss distribution rights \u2014 we\u2019re here to help.'}
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-premium-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-premium-dark">{content.contact_email_label as string || 'Email'}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{content.contact_email_value as string || 'info@alternateenterprises.com'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-premium-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-premium-dark">{content.contact_phone_label as string || 'Phone'}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{content.contact_phone_value as string || '+1 (555) 000-0000'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-premium-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-premium-dark">{content.contact_location_label as string || 'Location'}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{content.contact_location_value as string || 'Global Operations \u2014 Serving International Markets'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-premium-dark/5 rounded-lg border border-premium-gold/10">
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-2">
                    {content.contact_info_box_label as string || 'B2B Trade Only'}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {content.contact_info_box_text as string || 'All inquiries are handled by our trade team. We respond to bulk order and partnership requests within 24 hours.'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Health Warning */}
        {(content.section_health_warning_visible as string) !== 'false' && content.contact_health_warning && (
        <section className="bg-premium-dark border-t border-premium-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
              {content.contact_health_warning as string || 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.'}
            </p>
          </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
