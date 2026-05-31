'use client'

import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/Layout'
import { useSiteContent } from '@/context/SiteContent'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

export default function AboutPage() {
  const { content } = useSiteContent()

  const values = (Array.isArray(content.about_values_items) ? content.about_values_items : []).map(
    (s: string) => {
      const [title, desc] = s.split('|')
      return { title, desc }
    }
  )

  const stats = (Array.isArray(content.about_stats) ? content.about_stats : []).map(
    (s: string) => {
      const [value, label] = s.split('|')
      return { value, label }
    }
  )

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        {(content.section_about_visible as string) !== 'false' && (content.about_hero_heading_1 as string) && (
        <motion.section
          className="relative py-24 sm:py-32 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(199,154,59,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-tobacco-pattern opacity-[0.07]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {!!(content.about_hero_badge as string) && (
              <motion.div
                className="inline-flex items-center gap-2 border border-gold/20 rounded-full px-4 py-1.5 text-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(199,154,59,0.6)]" />
                {content.about_hero_badge as string}
              </motion.div>
              )}

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {!!(content.about_hero_heading_1 as string) && (
                  <><span className="text-white/90">{content.about_hero_heading_1 as string}</span><br /></>
                )}
                {!!(content.about_hero_heading_2 as string) && (
                  <><span className="text-gradient-gold">{content.about_hero_heading_2 as string}</span></>
                )}
              </motion.h1>

              {!!(content.about_hero_description as string) && (
              <motion.p
                className="text-sm sm:text-base text-gray-400/80 max-w-2xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {content.about_hero_description as string}
              </motion.p>
              )}
            </div>
          </div>
        </motion.section>
        )}

        {/* Stats Strip */}
        {stats.length > 0 && (
        <motion.section
          className="bg-premium-dark/90 border-y border-gold/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-gold">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        )}

        {/* Mission */}
        {(content.about_mission_heading as string) && (
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-12 h-px bg-gold/50 mx-auto mb-8" />
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mb-6 leading-tight"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                {content.about_mission_heading as string}
              </motion.h2>
              {!!(content.about_mission_body as string) && (
              <motion.p
                className="text-sm sm:text-base text-gray-500 leading-relaxed"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {content.about_mission_body as string}
              </motion.p>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Values */}
        {(content.about_values_heading as string) && values.length > 0 && (
        <section className="bg-white border-y border-tobacco-100 py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-14"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {content.about_values_heading as string}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="bg-cream rounded-xl p-6 sm:p-8 border border-tobacco-100 hover:border-gold/20 transition-all duration-300"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-charcoal mb-2">{v.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Content */}
        {(content.about_content as string) && (
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="divider-gold mb-10" />
            <motion.div
              className="text-sm sm:text-base text-gray-500 leading-relaxed whitespace-pre-line space-y-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {(content.about_content as string).split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </motion.div>
            <div className="divider-gold mt-10" />
          </div>
        </section>
        )}

        {/* Health Warning */}
        {(content.section_health_warning_visible as string) !== 'false' && content.about_health_warning && (
        <section className="bg-premium-dark border-t border-gold/5">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-[0.2em]">
              {content.about_health_warning as string}
            </p>
          </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
