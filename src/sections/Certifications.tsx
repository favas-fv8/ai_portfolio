import { useRef, useEffect } from 'react'
import { Award, ExternalLink } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import certificationsData from '@/data/certifications.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

const themes = ['indigo', 'purple', 'cyan', 'indigo', 'purple']

export default function Certifications() {
  const scrollRef = useRef<HTMLDivElement>(null!)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const resumeTimerRef = useRef<number>(0)

  const pauseAndResume = () => {
    pausedRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false
    }, 2000)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const scroll = () => {
      if (!pausedRef.current) {
        el.scrollLeft += 0.8
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
          el.scrollLeft = 0
        }
      }
      rafRef.current = requestAnimationFrame(scroll)
    }

    rafRef.current = requestAnimationFrame(scroll)

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaX || e.deltaY
      el.scrollLeft += delta * 0.5
      pauseAndResume()
    }

    let touchStartX = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      pausedRef.current = true
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }

    const onTouchMove = (e: TouchEvent) => {
      const delta = touchStartX - e.touches[0].clientX
      touchStartX = e.touches[0].clientX
      el.scrollLeft += delta
    }

    const onTouchEnd = () => {
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false
      }, 2000)
    }

    const onEnter = () => { pausedRef.current = true }
    const onLeave = () => { pausedRef.current = false }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
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

      <div
        ref={scrollRef}
        className="cert-scroll"
      >
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
    </SectionLayout>
  )
}
