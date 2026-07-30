import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Mail } from 'lucide-react'
import { LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { siteConfig } from '@/config/site'
import { SECTION_IDS } from '@/constants'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '@/hooks/useTheme'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const [isPreloaded, setIsPreloaded] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const { theme } = useTheme()

  const isLight = theme === 'light'

  const scrollToAbout = () => {
    document.getElementById(SECTION_IDS.about)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Preload all 150 frames
  useEffect(() => {
    const totalFrames = 150
    let loadedCount = 0

    const handleLoad = () => {
      loadedCount++
      setPreloadProgress(Math.round((loadedCount / totalFrames) * 100))
      if (loadedCount === totalFrames) {
        setIsPreloaded(true)
        if (imgRef.current) {
          imgRef.current.src = `/ai_portfolio/images/hero/ezgif-frame-001.png`
        }
      }
    }

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image()
      const frameNum = String(i).padStart(3, '0')
      img.src = `/ai_portfolio/images/hero/ezgif-frame-${frameNum}.png`
      img.onload = handleLoad
      img.onerror = handleLoad
    }
  }, [])

  // GSAP ScrollTrigger — only after preload
  useEffect(() => {
    if (!isPreloaded) return

    gsap.registerPlugin(ScrollTrigger)

    const totalFrames = 150
    const frameObj = { current: 1 }

    const ctx = gsap.context(() => {
      gsap.to(frameObj, {
        current: totalFrames,
        snap: 'current',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            if (imgRef.current) {
              const currentFrame = Math.max(1, Math.min(totalFrames, Math.round(frameObj.current)))
              const frameNum = String(currentFrame).padStart(3, '0')
              imgRef.current.src = `/ai_portfolio/images/hero/ezgif-frame-${frameNum}.png`
            }
            // Animate name letters expanding right on scroll
            if (nameRef.current) {
              const letters = nameRef.current.querySelectorAll('.hero-letter')
              const progress = self.progress
              letters.forEach((letter, i) => {
                const total = letters.length
                const offset = progress * ((i + 1) / total) * 120
                ;(letter as HTMLElement).style.transform = `translateX(${offset}px)`
              })
            }
          },
        },
      })
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [isPreloaded])

  // Side panel color: black in dark mode, white in light mode
  const panelBg = isLight ? '#ffffff' : '#000000'
  // Label: violet in light, steel blue/grey in dark
  const labelColor = isLight ? '#7c3aed' : '#94a3b8'
  // Subname & tagline: white in light, grey in dark
  const subNameColor = isLight ? '#ffffff' : '#94a3b8'
  const taglineColor = isLight ? '#e2e8f0' : '#64748b'
  // Icon: white in light, grey in dark
  const iconColor = isLight ? '#ffffff' : '#64748b'
  // Primary button: blue in light, violet in dark
  const btnPrimaryBg = isLight ? '#3b82f6' : '#7c3aed'
  const btnPrimaryHover = isLight ? '#2563eb' : '#6d28d9'

  return (
    <SectionLayout
      ref={sectionRef}
      id={SECTION_IDS.hero}
      className="relative min-h-screen flex items-center overflow-hidden transition-colors duration-500"
      containerClassName="w-full !py-0 flex flex-col justify-end min-h-screen"
    >
      {/* Background colour fill (reacts to theme) */}
      <div className="absolute inset-0 -z-10 transition-colors duration-500" style={{ background: panelBg }} />
      {/* Full-screen background layout: side panels + centered animation */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none flex">
        {/* Left panel */}
        <div className="flex-shrink-0 w-[15%] h-full transition-colors duration-500" style={{ background: panelBg }} />

        {/* Center: animation */}
        <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center">
          {/* Preload ring */}
          {!isPreloaded && (
            <div className="flex flex-col items-center justify-center gap-3 absolute inset-0 z-10">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" stroke="rgba(128,128,128,0.15)" strokeWidth="2.5" fill="transparent" />
                  <circle
                    cx="28" cy="28" r="24"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - preloadProgress / 100)}
                    className="transition-all duration-150 ease-out"
                  />
                </svg>
                <span className="text-[10px] font-mono text-accent-400">{preloadProgress}%</span>
              </div>
            </div>
          )}

          {/* Animation frame */}
          <img
            ref={imgRef}
            src="/ai_portfolio/images/hero/ezgif-frame-001.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: isPreloaded ? 1 : 0 }}
          />


          {/* Edge fades: left */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${panelBg}, transparent)` }}
          />
          {/* Edge fades: right */}
          <div
            className="absolute inset-y-0 right-0 w-1/3 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${panelBg}, transparent)` }}
          />
          {/* Edge fades: top */}
          <div
            className="absolute inset-x-0 top-0 h-1/4 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${panelBg}, transparent)` }}
          />
          {/* Edge fades: bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${panelBg}, transparent)` }}
          />
        </div>

        {/* Right panel */}
        <div className="flex-shrink-0 w-[15%] h-full transition-colors duration-500" style={{ background: panelBg }} />
      </div>

      {/* Foreground content: left-aligned overlay */}
      <div className="absolute bottom-5 ml-[20vh] left-0 z-10 w-full flex flex-col items-start text-left gap-7 max-w-2xl overflow-visible">
        {/* Label */}
        <p
          className="text-sm font-mono tracking-widest uppercase transition-colors duration-500"
          style={{ color: labelColor }}
        >
          {siteConfig.title}
        </p>

        {/* Name */}
        <h1 ref={nameRef} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none whitespace-nowrap">
          {/* First word — blue gradient */}
          {siteConfig.name.split(' ')[0].split('').map((char, i) => (
            <span
              key={`first-${i}`}
              className="hero-letter inline-block"
              style={{
                transition: 'transform 0.1s ease-out',
                background: 'linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >{char}</span>
          ))}
          <br />
          {/* Middle words — subNameColor */}
          {siteConfig.name.split(' ').slice(1, -1).join(' ').split('').map((char, i) => (
            <span key={`mid-${i}`} className="hero-letter inline-block transition-colors duration-500" style={{ color: subNameColor, transition: 'transform 0.1s ease-out, color 0.5s ease' }}>{char === ' ' ? '\u00A0' : char}</span>
          ))}
          {siteConfig.name.split(' ').length > 2 && <span className="inline-block">&nbsp;</span>}
          {/* Last word — blue gradient */}
          {siteConfig.name.split(' ').slice(-1)[0].split('').map((char, i) => (
            <span
              key={`last-${i}`}
              className="hero-letter inline-block"
              style={{
                transition: 'transform 0.1s ease-out',
                background: 'linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >{char}</span>
          ))}
        </h1>

        {/* Tagline */}
        <p
          className="max-w-md text-base leading-relaxed transition-colors duration-500"
          style={{ color: taglineColor }}
        >
          {siteConfig.tagline}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Primary: violet (dark) → blue (light) */}
          <button
            onClick={scrollToAbout}
            className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-glow"
            style={{ background: btnPrimaryBg }}
            onMouseEnter={e => (e.currentTarget.style.background = btnPrimaryHover)}
            onMouseLeave={e => (e.currentTarget.style.background = btnPrimaryBg)}
          >
            Explore My Work
          </button>
          {/* Secondary: ghost */}
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: isLight ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${isLight ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.15)'}`,
              color: isLight ? '#7c3aed' : '#ffffff',
            }}
          >
            Resume
          </a>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-5 mt-1">
          {([
            { href: siteConfig.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
            { href: siteConfig.twitter, label: 'X', Icon: TwitterIcon },
            { href: siteConfig.instagram, label: 'Instagram', Icon: InstagramIcon },
          ] as const).map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-glow transition-colors duration-300 hover:text-accent-400"
              style={{ color: iconColor }}
              aria-label={label}
            >
              <Icon size={22} />
            </a>
          ))}
          <a
            href={`mailto:${siteConfig.email}`}
            className="icon-glow transition-colors duration-300 hover:text-accent-400"
            style={{ color: iconColor }}
            aria-label="Email"
          >
            <Mail size={22} />
          </a>
        </div>
      </div>

      {/* Scroll down arrow */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-colors duration-300 hover:text-accent-400"
        style={{ color: iconColor }}
        aria-label="Scroll down"
      >
        <ArrowDown size={24} className="animate-bounce" />
      </button>
    </SectionLayout>
  )
}