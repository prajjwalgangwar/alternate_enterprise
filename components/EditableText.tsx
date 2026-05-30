'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
  type?: 'text' | 'textarea'
  className?: string
  placeholder?: string
  rows?: number
}

export default function EditableText({
  value,
  onChange,
  as: Tag = 'span',
  type = 'text',
  className = '',
  placeholder = 'Click to edit...',
  rows = 2,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select()
      }
    }
  }, [editing])

  function commit() {
    setEditing(false)
    if (draft !== value) {
      onChange(draft)
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (type === 'text') {
      if (e.key === 'Enter') commit()
      if (e.key === 'Escape') { setDraft(value); setEditing(false) }
    } else {
      if (e.key === 'Escape') { setDraft(value); setEditing(false) }
      if (e.key === 'Enter' && e.metaKey) commit()
    }
  }

  if (editing) {
    if (type === 'textarea') {
      return (
        <textarea
          ref={inputRef as any}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          rows={rows}
          className={`w-full rounded border border-premium-gold bg-white px-2 py-1 text-sm outline-none ring-2 ring-premium-gold/30 resize-y ${className}`}
        />
      )
    }
    return (
      <input
        ref={inputRef as any}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className={`w-full rounded border border-premium-gold bg-white px-2 py-1 text-sm outline-none ring-2 ring-premium-gold/30 ${className}`}
      />
    )
  }

  return (
    <Tag
      onClick={() => setEditing(true)}
      className={`cursor-pointer hover:ring-2 hover:ring-premium-gold/40 hover:ring-inset rounded px-0.5 transition-all ${!value ? 'text-gray-400 italic' : ''} ${className}`}
      title="Click to edit"
    >
      {value || placeholder}
    </Tag>
  )
}
