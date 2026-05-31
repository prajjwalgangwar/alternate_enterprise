'use client'

import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { useSiteContent } from '@/context/SiteContent'

export default function PrivacyPage() {
  const { content } = useSiteContent()

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {(content.section_privacy_visible as string) !== 'false' && (content.privacy_hero_heading_1 as string) && (
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
          <div className="absolute inset-0 bg-tobacco-pattern opacity-[0.07]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {!!(content.privacy_hero_badge as string) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 border border-gold/20 rounded-full px-4 py-1.5 text-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(199,154,59,0.6)]" />
              {content.privacy_hero_badge}
            </motion.div>
            )}

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {!!(content.privacy_hero_heading_1 as string) && <><span className="text-white/90">{content.privacy_hero_heading_1}</span>{' '}</>}
              {!!(content.privacy_hero_heading_2 as string) && <span className="text-gradient-gold">{content.privacy_hero_heading_2}</span>}
            </motion.h1>

            {!!(content.privacy_hero_description as string) && (
            <motion.p
              className="text-sm sm:text-base text-gray-400/80 max-w-xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {content.privacy_hero_description}
            </motion.p>
            )}
          </div>
        </section>
        )}

        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {!!(content.privacy_content as string) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line"
            >
              {content.privacy_content}
            </motion.div>
            )}
          </div>
        </section>

        {(content.section_health_warning_visible as string) !== 'false' && content.privacy_health_warning && (
        <section className="bg-premium-dark border-t border-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
              {content.privacy_health_warning as string}
            </p>
          </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
