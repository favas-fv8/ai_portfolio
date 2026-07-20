'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Command } from 'lucide-react'
import { cn } from '@/utils/cn'
import { navigationItems } from '@/config/navigation'

interface CommandItem {
  label: string
  description: string
  action: () => void
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const items: CommandItem[] = [
    ...navigationItems.map(item => ({
      label: item.label,
      description: `Navigate to ${item.label}`,
      action: () => {
        document.getElementById(item.sectionId)?.scrollIntoView({ behavior: 'smooth' })
        setOpen(false)
      },
    })),
    { label: 'Resume', description: 'Download resume', action: () => { window.open('/ai_portfolio/resume.pdf') ; setOpen(false) } },
    { label: 'GitHub', description: 'Open GitHub profile', action: () => { window.open('https://github.com/favas-fv8') ; setOpen(false) } },
    { label: 'LinkedIn', description: 'Open LinkedIn profile', action: () => { window.open('https://linkedin.com/in/favas-fv8') ; setOpen(false) } },
    { label: 'Contact', description: 'Scroll to contact section', action: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) ; setOpen(false) } },
  ]

  const filtered = query
    ? items.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.description.toLowerCase().includes(query.toLowerCase()),
      )
    : items

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] bg-black/30"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50">
          <Search size={18} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-gray-800 placeholder:text-gray-400 outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded">
            <Command size={12} />K
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No results found</p>
          )}
          {filtered.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg',
                'text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200',
                'group',
              )}
            >
              <span>{item.label}</span>
              <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                {item.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
