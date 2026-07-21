import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { navigationItems } from '@/config/navigation'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  let lastScroll = 0

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setScrolled(current > 50)
      setHidden(current > lastScroll && current > 200)
      lastScroll = current
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false)
    const el = document.getElementById(sectionId)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[300] transition-all duration-500',
        scrolled && 'glass',
        hidden && '-translate-y-full',
      )}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xl font-bold tracking-wider text-gradient"
          aria-label="Go to top"
        >
          Fv.8
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {navigationItems.map(item => (
            <li key={item.sectionId}>
              <button
                onClick={() => handleNavClick(item.sectionId)}
                className="text-sm text-dark-300 hover:text-text-primary transition-colors duration-300"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        className={cn(
          'md:hidden glass transition-all duration-500 overflow-hidden',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ul className="flex flex-col px-6 pb-6 pt-2 gap-4">
          {navigationItems.map(item => (
            <li key={item.sectionId}>
              <button
                onClick={() => handleNavClick(item.sectionId)}
                className="text-base text-dark-300 hover:text-text-primary transition-colors"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
