import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { navigationItems } from '@/config/navigation'
import { useTheme } from '@/hooks/useTheme'

export default function Navigation() {
  const { theme, toggleTheme } = useTheme()
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

        <div className="flex items-center gap-2 absolute right-6 md:right-8 top-1/2 -translate-y-1/2">
          <div className="toggle-cont">
            <input
              className="toggle-input"
              id="toggle"
              name="toggle"
              type="checkbox"
              checked={theme === 'light'}
              onChange={toggleTheme}
            />
            <label className="toggle-label" htmlFor="toggle">
              <div className="cont-icon">
                {Array.from({ length: 24 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      '--width': (i % 3) + 1,
                      '--deg': [25, 100, 280, 200, 30, 300, 250, 210, 100, 15, 75, 65, 50, 320, 220, 215, 135, 45, 78, 89, 65, 97, 174, 236][i],
                      '--duration': [11, 18, 5, 3, 20, 9, 4, 8, 9, 13, 18, 6, 7, 5, 5, 2, 9, 4, 16, 19, 14, 1, 10, 5][i],
                    } as React.CSSProperties}
                    className="sparkle"
                  />
                ))}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 30 30"
                  className="icon"
                >
                  <path
                    d="M0.96233 28.61C1.36043 29.0081 1.96007 29.1255 2.47555 28.8971L10.4256 25.3552C13.2236 24.11 16.4254 24.1425 19.2107 25.4401L27.4152 29.2747C27.476 29.3044 27.5418 29.3023 27.6047 29.32C27.6563 29.3348 27.7079 29.3497 27.761 29.3574C27.843 29.3687 27.9194 29.3758 28 29.3688C28.1273 29.3617 28.2531 29.3405 28.3726 29.2945C28.4447 29.262 28.5162 29.2287 28.5749 29.1842C28.6399 29.1446 28.6993 29.0994 28.7509 29.0477L28.9008 28.8582C28.9468 28.7995 28.9793 28.7274 29.0112 28.656C29.0599 28.5322 29.0811 28.4036 29.0882 28.2734C29.0939 28.1957 29.0868 28.1207 29.0769 28.0415C29.0705 27.9955 29.0585 27.9524 29.0472 27.9072C29.0295 27.8343 29.0302 27.7601 28.9984 27.6901L25.1638 19.4855C23.8592 16.7073 23.8273 13.5048 25.0726 10.7068L28.6145 2.75679C28.8429 2.24131 28.7318 1.63531 28.3337 1.2372C27.9165 0.820011 27.271 0.721743 26.7491 0.9961L19.8357 4.59596C16.8418 6.15442 13.2879 6.18696 10.2615 4.70062L1.80308 0.520214C1.7055 0.474959 1.60722 0.441742 1.50964 0.421943C1.44459 0.409215 1.37882 0.395769 1.3074 0.402133C1.14406 0.395769 0.981436 0.428275 0.818095 0.499692C0.77284 0.519491 0.719805 0.545671 0.67455 0.578198C0.596061 0.617088 0.524653 0.675786 0.4596 0.74084C0.394546 0.805894 0.335843 0.877306 0.296245 0.956502C0.263718 1.00176 0.237561 1.05477 0.217762 1.10003C0.152708 1.24286 0.126545 1.40058 0.120181 1.54978C0.120181 1.61483 0.126527 1.6735 0.132891 1.73219C0.15269 1.85664 0.178881 1.97332 0.237571 2.08434L4.41798 10.5427C5.91139 13.5621 5.8725 17.1238 4.3204 20.1099L0.720514 27.0233C0.440499 27.5536 0.545137 28.1928 0.96233 28.61Z"
                  />
                </svg>
              </div>
            </label>
          </div>
          <button
            className="md:hidden text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
