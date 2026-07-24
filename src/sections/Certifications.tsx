import { useRef, useEffect } from 'react'
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import certificationsData from '@/data/certifications.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

const themes = ['indigo', 'purple', 'cyan', 'indigo', 'purple']

export default function Certifications() {
  const scrollRef = useRef<HTMLDivElement>(null!)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)

  const scrollBy = (dir: number) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 220
    const gap = 48
    const step = (cardWidth + gap) * dir
    el.scrollLeft += step
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    rafRef.current = requestAnimationFrame(function scroll() {
      if (!pausedRef.current) {
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
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <SectionLayout id={SECTION_IDS.certifications} className="bg-dark-900">
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Certifications
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Professional <span className="text-gradient">Credentials</span>
        </h2>
      </AnimatedSection>

      <div className="relative">
        <button
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full glass text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 -ml-5"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full glass text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 -mr-5"
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
                    <div className="icon-wrap">
                      <Award size={40} />
                    </div>

                    <h3>{cert.title}</h3>

                    <p className="date">{cert.date}</p>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="credential-link"
                      >
                        View Credential <ExternalLink size={12} />
                      </a>
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
    </SectionLayout>
  )
}
