import { useRef, useEffect, useState, useCallback } from 'react'
import { ExternalLink, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import certificationsData from '@/data/certifications.json'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CertPreviewModal from '@/components/ui/CertPreviewModal'
import { useTheme } from '@/hooks/useTheme'

const themes = ['indigo', 'purple', 'cyan', 'indigo', 'purple']

const MANUAL_PAUSE_MS = 3000
const MANUAL_ANIMATION_MS = 600

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return title
  const parts = title.split(highlight)
  return (
    <>
      {parts[0]}
      <span className="cert-highlight">{highlight}</span>
      {parts[1] || ''}
    </>
  )
}

export default function Certifications() {
  const scrollRef = useRef<HTMLDivElement>(null!)
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const manualHoldRef = useRef(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const manualAnimRef = useRef<number>(0)
  const [previewFile, setPreviewFile] = useState<{ url: string; title: string; extraImages?: string[] } | null>(null)

  const scrollBy = useCallback((dir: number) => {
    const el = scrollRef.current
    if (!el) return
    // Hold auto-scroll for a few seconds so the manual step stays visible
    manualHoldRef.current = true
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      manualHoldRef.current = false
      resumeTimeoutRef.current = null
    }, MANUAL_PAUSE_MS)
    const cardWidth = 220
    const gap = 48
    // Half-card step for slower manual scrolling + smooth eased animation
    const step = ((cardWidth + gap) / 2) * dir
    if (manualAnimRef.current) cancelAnimationFrame(manualAnimRef.current)
    const oneSet = el.scrollWidth / 3
    const max = el.scrollWidth - el.clientWidth
    let start = el.scrollLeft
    let rawTarget = start + step
    // Seamless wrap: jump by exactly one set (visually identical, 3 copies),
    // then animate the small step — no visible jump.
    if (rawTarget < 0) {
      start += oneSet
      el.scrollLeft = start
      rawTarget = start + step
    } else if (rawTarget > max) {
      start -= oneSet
      el.scrollLeft = start
      rawTarget = start + step
    }
    const end = Math.min(Math.max(rawTarget, 0), max)
    const startTime = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / MANUAL_ANIMATION_MS, 1)
      const eased = easeInOutCubic(progress)
      el.scrollLeft = start + (end - start) * eased
      if (progress < 1) {
        manualAnimRef.current = requestAnimationFrame(animate)
      } else {
        el.scrollLeft = end
        manualAnimRef.current = 0
      }
    }
    manualAnimRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    rafRef.current = requestAnimationFrame(function scroll() {
      if (!pausedRef.current && !manualHoldRef.current) {
        el.scrollLeft += 0.8
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
          el.scrollLeft = 0
        }
      }
      rafRef.current = requestAnimationFrame(scroll)
    })

    const onEnter = () => { pausedRef.current = true }
    const onLeave = () => { pausedRef.current = false }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (manualAnimRef.current) {
        cancelAnimationFrame(manualAnimRef.current)
        manualAnimRef.current = 0
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = null
      }
      manualHoldRef.current = false
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <SectionLayout id={SECTION_IDS.certifications} className="bg-dark-900">
      <AnimatedSection className="text-center mb-8 md:mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Certifications
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Professional <span className="text-gradient">Credentials</span>
        </h2>
      </AnimatedSection>

      <div className="relative px-2 md:px-0">
        <button
          onClick={() => scrollBy(-1)}
          className={`absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full glass transition-all duration-300 ${isLight ? 'text-gray-900 hover:text-black hover:bg-black/5' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className={`absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full glass transition-all duration-300 ${isLight ? 'text-gray-900 hover:text-black hover:bg-black/5' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        <div ref={scrollRef} className="cert-scroll">
          <div className="cert-track">
            {[...certificationsData, ...certificationsData, ...certificationsData].map((cert, i) => {
              const theme = themes[i % themes.length]
              return (
                <div key={`${cert.id}-${i}`} className={`cert-card ${theme} cert-card-hover`}>
                  <div className="top-strip">
                    <span>{cert.issuer}</span>
                  </div>

                  <div className="badge">
                    <div className="badge-inner">{String((i % certificationsData.length) + 1).padStart(2, '0')}</div>
                  </div>

                  <div className="content">
                    {cert.image && (
                      <div className="image-layer">
                        {cert.image.endsWith('.pdf') ? (
                          <embed src={`${cert.image}#toolbar=0&scrollbar=0&view=Fit`} type="application/pdf" className="pdf-embed" />
                        ) : (
                          <img src={cert.image} alt={cert.title} />
                        )}
                      </div>
                    )}

                    <h3>{renderTitle(cert.title, cert.highlight)}</h3>

                    <p className="date">{cert.date.split('-')[0]}</p>

                    {cert.credentialUrl && cert.credentialUrl !== '#' && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="credential-link"
                      >
                        View Credential <ExternalLink size={12} />
                      </a>
                    )}
                    {cert.image && (
                      <button
                        onClick={() => setPreviewFile({ url: cert.image, title: cert.title, extraImages: cert.extraImages })}
                        className="preview-btn"
                        aria-label="Preview certificate"
                      >
                        <Eye size={16} />
                        <span className="preview-tooltip">Preview Certificate</span>
                      </button>
                    )}
                  </div>

                  <div className="layer layer1" />
                  <div className="layer layer2" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <CertPreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || ''}
        title={previewFile?.title || ''}
        extraImages={previewFile?.extraImages}
      />
    </SectionLayout>
  )
}
