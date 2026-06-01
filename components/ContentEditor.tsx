'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSiteContent } from '@/context/SiteContent'
import { SiteContent, defaultSiteContent } from '@/services/firestore/siteContent'
import EditableText from './EditableText'
import Toast from './Toast'

type ToastState = { message: string; type: 'success' | 'error' } | null

const SECTIONS = [
  { id: 'age_gate', label: 'Age Gate', visibilityKey: 'section_age_gate_visible', primaryKey: 'age_gate_heading' },
  { id: 'header', label: 'Header', visibilityKey: 'section_header_banner_visible', primaryKey: 'header_health_warning' },
  { id: 'about', label: 'About', visibilityKey: 'section_about_visible', primaryKey: 'about_hero_heading_1' },
  { id: 'hero', label: 'Hero', visibilityKey: 'section_hero_visible', primaryKey: 'home_hero_heading_1' },
  { id: 'stats', label: 'Stats', visibilityKey: 'section_stats_visible', primaryKey: 'home_stats' },
  { id: 'categories', label: 'Categories', visibilityKey: 'section_categories_visible', primaryKey: 'home_categories_items' },
  { id: 'featured', label: 'Featured', visibilityKey: 'section_featured_visible', primaryKey: 'home_featured_heading' },
  { id: 'contact', label: 'Contact', visibilityKey: 'section_contact_visible', primaryKey: 'home_contact_heading' },
  { id: 'privacy', label: 'Privacy', visibilityKey: 'section_privacy_visible', primaryKey: 'privacy_hero_heading_1' },
  { id: 'terms', label: 'Terms', visibilityKey: 'section_terms_visible', primaryKey: 'terms_hero_heading_1' },
  { id: 'faq', label: 'FAQ', visibilityKey: 'section_faq_visible', primaryKey: 'faq_hero_heading_1' },
  { id: 'footer', label: 'Footer', visibilityKey: 'section_footer_visible', primaryKey: '' },
] as const

function getDisplayValue(content: Record<string, string>, key: string): string {
  return content[key] || ''
}

function SectionToggle({ visible, onChange }: { visible: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!visible)}
      className={`relative w-8 h-4 rounded-full transition-colors ${visible ? 'bg-gold' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${visible ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  )
}

function HiddenOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
      <span className="text-[10px] uppercase tracking-widest text-white/70 font-semibold bg-black/50 px-4 py-2 rounded-full">
        Section Hidden
      </span>
    </div>
  )
}

export default function ContentEditor() {
  const { content: remoteContent, updateContent } = useSiteContent()
  const [local, setLocal] = useState<Record<string, string>>({})
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)
  const [activeSection, setActiveSection] = useState<string>('hero')

  useEffect(() => {
    if (!remoteContent || Object.keys(remoteContent).length === 0) return
    const init: Record<string, string> = {}
    for (const [key, val] of Object.entries(defaultSiteContent)) {
      const remote = remoteContent[key]
      init[key] = remote !== undefined
        ? (Array.isArray(remote) ? remote.join('\n') : String(remote))
        : (Array.isArray(val) ? val.join('\n') : String(val))
    }
    setLocal(init)
    setReady(true)
  }, [remoteContent])

  const setValue = useCallback((key: string, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }))
  }, [])

  function toggleVisibility(key: string) {
    setLocal((prev) => ({ ...prev, [key]: prev[key] === 'false' ? 'true' : 'false' }))
  }

  function isVisible(key: string): boolean {
    return local[key] !== 'false'
  }

  function hasContent(key: string): boolean {
    const val = local[key]
    if (!val) return false
    const defaultValue = defaultSiteContent[key]
    if (Array.isArray(defaultValue)) {
      return val.split('\n').filter(Boolean).length > 0
    }
    return val.trim() !== ''
  }

  async function handleSave() {
    setSaving(true)
    try {
      const updates: Partial<SiteContent> = {}
      for (const [key, val] of Object.entries(local)) {
        if (!(key in defaultSiteContent)) continue
        const defaultValue = defaultSiteContent[key]
        if (Array.isArray(defaultValue)) {
          updates[key] = val.split('\n').filter(Boolean)
        } else {
          updates[key] = val
        }
      }
      await updateContent(updates)
      setToast({ message: 'All changes saved successfully', type: 'success' })
    } catch (err) {
      console.error('Save failed:', err)
      setToast({ message: err instanceof Error ? err.message : 'Failed to save changes', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const v = (key: string) => getDisplayValue(local, key)

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-24 text-tobacco-500">
        <div className="inline-block w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mr-3" />
        <span className="text-sm">Loading content...</span>
      </div>
    )
  }

  const navKeys = ['nav_home', 'nav_offerings', 'nav_contact']
  const statsArr = local.home_stats?.split('\n').filter(Boolean) || []
  const catItems = local.home_categories_items?.split('\n').filter(Boolean) || []

  const section = SECTIONS.find((s) => s.id === activeSection)
  const sectionVisible = section ? isVisible(section.visibilityKey) : true

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Section switcher */}
      <div className="sticky top-0 z-30 -mx-6 -mt-6 mb-6 bg-white border-b border-tobacco-200 px-6 pt-4 pb-0 flex flex-wrap gap-1">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`text-[10px] uppercase tracking-[0.15em] font-semibold px-3.5 py-2 rounded-t-lg transition-all flex items-center gap-2 ${
              activeSection === s.id
                ? 'bg-premium-dark text-gold'
                : 'text-gray-500 hover:text-charcoal hover:bg-tobacco-50'
            }`}
          >
            {s.label}
            {(!isVisible(s.visibilityKey) || (s.primaryKey && !hasContent(s.primaryKey))) && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 pb-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold text-[10px] px-4 py-2 tracking-wider uppercase disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-cream border border-tobacco-100 rounded-xl overflow-hidden shadow-sm relative">

        {/* === AGE GATE === */}
        {activeSection === 'age_gate' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <span className="w-1 h-4 bg-gold rounded-full" />
                Age Gate
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="px-6 pb-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Heading</span>
                  <EditableText value={getDisplayValue(local, 'age_gate_heading')} onChange={(v) => setValue('age_gate_heading', v)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Background Image URL</span>
                  <EditableText value={getDisplayValue(local, 'age_gate_image')} onChange={(v) => setValue('age_gate_image', v)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Description</span>
                <EditableText value={getDisplayValue(local, 'age_gate_description')} onChange={(v) => setValue('age_gate_description', v)} type="textarea" rows={3} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Yes Button Text</span>
                  <EditableText value={getDisplayValue(local, 'age_gate_yes_button')} onChange={(v) => setValue('age_gate_yes_button', v)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">No Button Text</span>
                  <EditableText value={getDisplayValue(local, 'age_gate_no_button')} onChange={(v) => setValue('age_gate_no_button', v)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Redirect URL (underage)</span>
                <EditableText value={getDisplayValue(local, 'age_gate_redirect_url')} onChange={(v) => setValue('age_gate_redirect_url', v)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
              </label>
            </div>
          </div>
        )}

        {/* === HEADER === */}
        {activeSection === 'header' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <span className="w-1 h-4 bg-gold rounded-full" />
                Navigation
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="px-6 pb-4 space-y-4">
              <div className="flex items-center gap-6 flex-wrap">
                {navKeys.map((k) => (
                  <EditableText key={k} value={v(k)} onChange={(val) => setValue(k, val)} className="text-sm uppercase tracking-wider font-medium text-gray-600" />
                ))}
              </div>
              <div className="border-t border-tobacco-100 pt-4 space-y-3">
                <EditableText value={v('header_health_warning')} onChange={(val) => setValue('header_health_warning', val)} type="textarea" rows={2} className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50 px-4 py-2 rounded" />
                <EditableText value={v('header_tagline')} onChange={(val) => setValue('header_tagline', val)} className="text-[9px] uppercase tracking-widest text-gold/60" />
              </div>
            </div>
          </div>
        )}

        {/* === ABOUT === */}
        {activeSection === 'about' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">About Us</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 sm:p-12 pt-2">
              <div className="max-w-3xl space-y-5">
                <EditableText value={v('about_hero_badge')} onChange={(val) => setValue('about_hero_badge', val)} className="inline-block text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/20 rounded-full px-4 py-1.5" />
                <div className="text-4xl sm:text-5xl font-bold leading-[1.1] space-y-1">
                  <EditableText value={v('about_hero_heading_1')} onChange={(val) => setValue('about_hero_heading_1', val)} as="div" className="text-white/90" />
                  <EditableText value={v('about_hero_heading_2')} onChange={(val) => setValue('about_hero_heading_2', val)} as="div" className="text-gradient-gold" />
                </div>
                <EditableText value={v('about_hero_description')} onChange={(val) => setValue('about_hero_description', val)} type="textarea" rows={2} as="p" className="text-sm sm:text-base text-gray-400/80 max-w-xl leading-relaxed" />
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Mission Heading</span>
                  <EditableText value={v('about_mission_heading')} onChange={(val) => setValue('about_mission_heading', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Values Heading</span>
                  <EditableText value={v('about_values_heading')} onChange={(val) => setValue('about_values_heading', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Mission Body</span>
                <EditableText value={v('about_mission_body')} onChange={(val) => setValue('about_mission_body', val)} type="textarea" rows={3} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Values (title|desc per line)</span>
                <EditableText value={v('about_values_items')} onChange={(val) => setValue('about_values_items', val)} type="textarea" rows={5} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Stats (value|label per line)</span>
                <EditableText value={v('about_stats')} onChange={(val) => setValue('about_stats', val)} type="textarea" rows={4} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Content Body</span>
                <EditableText value={v('about_content')} onChange={(val) => setValue('about_content', val)} type="textarea" rows={8} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
              </label>
              <EditableText value={v('about_health_warning')} onChange={(val) => setValue('about_health_warning', val)} type="textarea" rows={3} className="text-[10px] text-gray-600 uppercase tracking-wider leading-relaxed text-center" />
            </div>
          </div>
        )}

        {/* === HERO === */}
        {activeSection === 'hero' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">Hero Section</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 sm:p-12 pt-2">
              <div className="max-w-3xl space-y-5">
                <EditableText value={v('home_hero_badge')} onChange={(val) => setValue('home_hero_badge', val)} className="inline-block text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/20 rounded-full px-4 py-1.5" />
                <div className="text-4xl sm:text-5xl font-bold leading-[1.1] space-y-1">
                  <EditableText value={v('home_hero_heading_1')} onChange={(val) => setValue('home_hero_heading_1', val)} as="div" className="text-white/90" />
                  <EditableText value={v('home_hero_heading_2')} onChange={(val) => setValue('home_hero_heading_2', val)} as="div" className="text-gradient-gold" />
                  <EditableText value={v('home_hero_heading_3')} onChange={(val) => setValue('home_hero_heading_3', val)} as="div" className="text-white/90" />
                </div>
                <EditableText value={v('home_hero_description')} onChange={(val) => setValue('home_hero_description', val)} type="textarea" rows={2} as="p" className="text-sm sm:text-base text-gray-400/80 max-w-xl leading-relaxed" />
                <div className="flex gap-3 pt-2">
                  <EditableText value={v('home_hero_cta_1') || 'Explore Collection'} onChange={(val) => setValue('home_hero_cta_1', val)} className="inline-block bg-gradient-to-r from-gold to-amber-500 text-charcoal text-xs font-bold px-5 py-2.5 rounded-full tracking-wider uppercase shadow-lg" />
                  <EditableText value={v('home_hero_cta_2') || 'Request a Quote'} onChange={(val) => setValue('home_hero_cta_2', val)} className="inline-block border border-gold/30 text-gold text-xs px-5 py-2.5 rounded-full tracking-wider uppercase font-semibold" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === STATS === */}
        {activeSection === 'stats' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-premium-dark">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">Stats</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-premium-dark px-6 pb-6 space-y-4">
              <EditableText value={v('home_stats')} onChange={(val) => setValue('home_stats', val)} type="textarea" rows={4} className="text-sm font-mono text-gold bg-premium-dark/50 border border-gold/20 rounded-lg p-3" placeholder="value|label, one per line" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {statsArr.map((line, i) => {
                  const [val, label] = line.split('|')
                  return (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-gold">{val || '—'}</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{label || '—'}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* === CATEGORIES === */}
        {activeSection === 'categories' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <span className="w-1 h-4 bg-gold rounded-full" />
                Categories
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <EditableText value={v('home_categories_section_label')} onChange={(val) => setValue('home_categories_section_label', val)} className="text-gold text-[10px] uppercase tracking-wider font-semibold" />
              <EditableText value={v('home_categories_heading')} onChange={(val) => setValue('home_categories_heading', val)} as="h2" className="text-3xl font-bold text-charcoal" />
              <EditableText value={v('home_categories_description')} onChange={(val) => setValue('home_categories_description', val)} as="p" className="text-sm text-gray-500 max-w-xl" />
              <div className="pt-2">
                <EditableText value={v('home_categories_items')} onChange={(val) => setValue('home_categories_items', val)} type="textarea" rows={5} className="text-sm font-mono border border-tobacco-200 rounded-lg p-3" placeholder="title|description|specs, one per line" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {catItems.map((line, i) => {
                  const parts = line.split('|')
                  return (
                    <div key={i} className="bg-white rounded-xl p-4 border border-tobacco-100 text-center">
                      <div className="text-sm font-bold text-charcoal">{parts[0] || '—'}</div>
                      {parts[2] && <div className="text-[10px] text-gold mt-2 tracking-wider">{parts[2]}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* === FEATURED === */}
        {activeSection === 'featured' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-premium-dark">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">Featured Section</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-premium-dark px-6 pb-6 space-y-4">
              <EditableText value={v('home_featured_section_label')} onChange={(val) => setValue('home_featured_section_label', val)} className="text-gold text-[10px] uppercase tracking-wider font-semibold" />
              <EditableText value={v('home_featured_heading')} onChange={(val) => setValue('home_featured_heading', val)} as="h2" className="text-3xl font-bold text-white" />
              <EditableText value={v('home_featured_description')} onChange={(val) => setValue('home_featured_description', val)} type="textarea" rows={2} as="p" className="text-sm text-gray-400 max-w-xl" />
            </div>
          </div>
        )}

        {/* === CONTACT === */}
        {activeSection === 'contact' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">Contact Page</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 sm:p-12 pt-2">
              <div className="max-w-3xl space-y-5">
                <EditableText value={v('contact_hero_badge')} onChange={(val) => setValue('contact_hero_badge', val)} className="inline-block text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/20 rounded-full px-4 py-1.5" />
                <div className="text-4xl sm:text-5xl font-bold leading-[1.1] space-y-1">
                  <EditableText value={v('contact_hero_heading_1')} onChange={(val) => setValue('contact_hero_heading_1', val)} as="div" className="text-white/90" />
                  <EditableText value={v('contact_hero_heading_2')} onChange={(val) => setValue('contact_hero_heading_2', val)} as="div" className="text-gradient-gold" />
                </div>
                <EditableText value={v('contact_hero_description')} onChange={(val) => setValue('contact_hero_description', val)} type="textarea" rows={2} as="p" className="text-sm sm:text-base text-gray-400/80 max-w-xl leading-relaxed" />
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Section Heading</span>
                  <EditableText value={v('contact_section_heading')} onChange={(val) => setValue('contact_section_heading', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Homepage Section Label</span>
                  <EditableText value={v('home_contact_section_label')} onChange={(val) => setValue('home_contact_section_label', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">Section Description</span>
                <EditableText value={v('contact_section_description')} onChange={(val) => setValue('contact_section_description', val)} type="textarea" rows={2} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
              </label>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3">Contact Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Email Label</span>
                    <EditableText value={v('contact_email_label')} onChange={(val) => setValue('contact_email_label', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Email Value</span>
                    <EditableText value={v('contact_email_value')} onChange={(val) => setValue('contact_email_value', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Phone Label</span>
                    <EditableText value={v('contact_phone_label')} onChange={(val) => setValue('contact_phone_label', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Phone Value</span>
                    <EditableText value={v('contact_phone_value')} onChange={(val) => setValue('contact_phone_value', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Location Label</span>
                    <EditableText value={v('contact_location_label')} onChange={(val) => setValue('contact_location_label', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Location Value</span>
                    <EditableText value={v('contact_location_value')} onChange={(val) => setValue('contact_location_value', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3">Info Box</p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Label</span>
                    <EditableText value={v('contact_info_box_label')} onChange={(val) => setValue('contact_info_box_label', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 block">Text</span>
                    <EditableText value={v('contact_info_box_text')} onChange={(val) => setValue('contact_info_box_text', val)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2" />
                  </label>
                </div>
              </div>
              <EditableText value={v('home_contact_heading')} onChange={(val) => setValue('home_contact_heading', val)} as="h2" className="text-3xl font-bold text-charcoal" />
              <EditableText value={v('home_contact_description')} onChange={(val) => setValue('home_contact_description', val)} type="textarea" rows={2} as="p" className="text-sm text-gray-500 max-w-xl" />
              <EditableText value={v('home_health_warning')} onChange={(val) => setValue('home_health_warning', val)} type="textarea" rows={3} className="text-[10px] text-gray-600 uppercase tracking-wider leading-relaxed text-center" />
              <EditableText value={v('contact_health_warning')} onChange={(val) => setValue('contact_health_warning', val)} type="textarea" rows={3} className="text-[10px] text-gray-600 uppercase tracking-wider leading-relaxed text-center" />
            </div>
          </div>
        )}

        {/* === FOOTER === */}
        {activeSection === 'footer' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-premium-dark">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">Footer</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-premium-dark px-6 pb-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <EditableText value={v('footer_company_name')} onChange={(val) => setValue('footer_company_name', val)} as="h3" className="text-gold font-bold tracking-wider text-lg" />
                  <EditableText value={v('footer_description')} onChange={(val) => setValue('footer_description', val)} type="textarea" rows={2} as="p" className="text-sm text-gray-500" />
                </div>
                <div className="space-y-2">
                  <EditableText value={v('footer_products_heading')} onChange={(val) => setValue('footer_products_heading', val)} as="h4" className="text-white/80 text-sm font-semibold" />
                  <EditableText value={v('footer_product_list')} onChange={(val) => setValue('footer_product_list', val)} type="textarea" rows={4} className="text-sm font-mono text-gray-500" placeholder="one per line" />
                </div>
                <div className="space-y-2">
                  <EditableText value={v('footer_quick_links_heading')} onChange={(val) => setValue('footer_quick_links_heading', val)} as="h4" className="text-white/80 text-sm font-semibold" />
                  <EditableText value={v('footer_quick_links')} onChange={(val) => setValue('footer_quick_links', val)} type="textarea" rows={4} className="text-sm font-mono text-gray-500" placeholder="one per line" />
                </div>
                <div className="space-y-2">
                  <EditableText value={v('footer_contact_heading')} onChange={(val) => setValue('footer_contact_heading', val)} as="h4" className="text-white/80 text-sm font-semibold" />
                  <EditableText value={v('footer_email')} onChange={(val) => setValue('footer_email', val)} className="text-sm text-gray-500" />
                  <EditableText value={v('footer_phone')} onChange={(val) => setValue('footer_phone', val)} className="text-sm text-gray-500" />
                </div>
              </div>
              <div className="border-t border-gold/10 pt-4 space-y-2">
                <EditableText value={v('footer_health_warning')} onChange={(val) => setValue('footer_health_warning', val)} type="textarea" rows={2} className="text-[10px] text-gray-600 leading-relaxed text-center" />
                <EditableText value={v('footer_copyright')} onChange={(val) => setValue('footer_copyright', val)} className="text-xs text-center text-gray-600/80 block" />
              </div>
            </div>
          </div>
        )}

        {/* === PRIVACY === */}
        {activeSection === 'privacy' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">Privacy Page</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 sm:p-12 pt-2">
              <div className="max-w-3xl space-y-5">
                <EditableText value={v('privacy_hero_badge')} onChange={(val) => setValue('privacy_hero_badge', val)} className="inline-block text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/20 rounded-full px-4 py-1.5" />
                <div className="text-4xl sm:text-5xl font-bold leading-[1.1] space-y-1">
                  <EditableText value={v('privacy_hero_heading_1')} onChange={(val) => setValue('privacy_hero_heading_1', val)} as="div" className="text-white/90" />
                  <EditableText value={v('privacy_hero_heading_2')} onChange={(val) => setValue('privacy_hero_heading_2', val)} as="div" className="text-gradient-gold" />
                </div>
                <EditableText value={v('privacy_hero_description')} onChange={(val) => setValue('privacy_hero_description', val)} type="textarea" rows={2} as="p" className="text-sm sm:text-base text-gray-400/80 max-w-xl leading-relaxed" />
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4 pt-4">
              <EditableText value={v('privacy_content')} onChange={(val) => setValue('privacy_content', val)} type="textarea" rows={8} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line border border-tobacco-200 rounded-lg p-4" />
              <EditableText value={v('privacy_health_warning')} onChange={(val) => setValue('privacy_health_warning', val)} type="textarea" rows={3} className="text-[10px] text-gray-600 uppercase tracking-wider leading-relaxed text-center" />
            </div>
          </div>
        )}

        {/* === TERMS === */}
        {activeSection === 'terms' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">Terms Page</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 sm:p-12 pt-2">
              <div className="max-w-3xl space-y-5">
                <EditableText value={v('terms_hero_badge')} onChange={(val) => setValue('terms_hero_badge', val)} className="inline-block text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/20 rounded-full px-4 py-1.5" />
                <div className="text-4xl sm:text-5xl font-bold leading-[1.1] space-y-1">
                  <EditableText value={v('terms_hero_heading_1')} onChange={(val) => setValue('terms_hero_heading_1', val)} as="div" className="text-white/90" />
                  <EditableText value={v('terms_hero_heading_2')} onChange={(val) => setValue('terms_hero_heading_2', val)} as="div" className="text-gradient-gold" />
                </div>
                <EditableText value={v('terms_hero_description')} onChange={(val) => setValue('terms_hero_description', val)} type="textarea" rows={2} as="p" className="text-sm sm:text-base text-gray-400/80 max-w-xl leading-relaxed" />
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4 pt-4">
              <EditableText value={v('terms_content')} onChange={(val) => setValue('terms_content', val)} type="textarea" rows={8} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line border border-tobacco-200 rounded-lg p-4" />
              <EditableText value={v('terms_health_warning')} onChange={(val) => setValue('terms_health_warning', val)} type="textarea" rows={3} className="text-[10px] text-gray-600 uppercase tracking-wider leading-relaxed text-center" />
            </div>
          </div>
        )}

        {/* === FAQ === */}
        {activeSection === 'faq' && (
          <div className="relative">
            {!sectionVisible && <HiddenOverlay />}
            <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
              <h3 className="text-sm font-bold text-gold/60 uppercase tracking-wider">FAQ Page</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Visible</span>
                <SectionToggle visible={sectionVisible} onChange={() => toggleVisibility(section!.visibilityKey)} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 sm:p-12 pt-2">
              <div className="max-w-3xl space-y-5">
                <EditableText value={v('faq_hero_badge')} onChange={(val) => setValue('faq_hero_badge', val)} className="inline-block text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/20 rounded-full px-4 py-1.5" />
                <div className="text-4xl sm:text-5xl font-bold leading-[1.1] space-y-1">
                  <EditableText value={v('faq_hero_heading_1')} onChange={(val) => setValue('faq_hero_heading_1', val)} as="div" className="text-white/90" />
                  <EditableText value={v('faq_hero_heading_2')} onChange={(val) => setValue('faq_hero_heading_2', val)} as="div" className="text-gradient-gold" />
                </div>
                <EditableText value={v('faq_hero_description')} onChange={(val) => setValue('faq_hero_description', val)} type="textarea" rows={2} as="p" className="text-sm sm:text-base text-gray-400/80 max-w-xl leading-relaxed" />
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4 pt-4">
              <EditableText value={v('faq_items')} onChange={(val) => setValue('faq_items', val)} type="textarea" rows={8} className="text-sm font-mono text-gray-600 border border-tobacco-200 rounded-lg p-4" placeholder="question|answer, one per line" />
              <EditableText value={v('faq_health_warning')} onChange={(val) => setValue('faq_health_warning', val)} type="textarea" rows={3} className="text-[10px] text-gray-600 uppercase tracking-wider leading-relaxed text-center" />
            </div>
          </div>
        )}

      </div>

      {/* Bottom save bar */}
      <div className="mt-6 flex items-center justify-between bg-white border border-tobacco-200 rounded-xl px-6 py-4 shadow-sm">
        <p className="text-xs text-gray-400">
          Click any text to edit inline. Toggle sections on/off with the switch.
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-gold text-sm px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
