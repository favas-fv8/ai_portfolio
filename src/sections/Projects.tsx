import { useState, useRef, useEffect } from 'react'
import { ExternalLink, Image as ImageIcon } from 'lucide-react'
import { GithubIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import projectsData from '@/data/projects.json'
import { cn } from '@/utils/cn'
import AnimatedSection from '@/components/ui/AnimatedSection'

const categories = ['all', 'fullstack', 'frontend', 'backend'] as const

export default function Projects() {
  const [active, setActive] = useState<string>('all')
  const scrollRef = useRef<HTMLDivElement>(null!)
  const trackRef = useRef<HTMLDivElement>(null!)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const posRef = useRef(0)
  const resumeTimerRef = useRef<number>(0)

  const filtered = active === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === active)

  const pauseAndResume = () => {
    pausedRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false
    }, 2000)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    posRef.current = 0
    const oneSet = track.scrollWidth / 3

    const scroll = () => {
      if (!pausedRef.current) {
        posRef.current -= 0.8
        if (Math.abs(posRef.current) >= oneSet) {
          posRef.current = 0
        }
        track.style.transform = `translateX(${posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(scroll)
    }

    rafRef.current = requestAnimationFrame(scroll)

    const container = scrollRef.current
    if (!container) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const track = trackRef.current
      if (!track) return

      const delta = e.deltaX || e.deltaY
      posRef.current -= delta * 0.5
      track.style.transform = `translateX(${posRef.current}px)`
      pauseAndResume()
    }

    let touchStartX = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      pausedRef.current = true
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }

    const onTouchMove = (e: TouchEvent) => {
      const track = trackRef.current
      if (!track) return
      const delta = touchStartX - e.touches[0].clientX
      touchStartX = e.touches[0].clientX
      posRef.current -= delta
      track.style.transform = `translateX(${posRef.current}px)`
    }

    const onTouchEnd = () => {
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false
      }, 2000)
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [filtered])

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    pausedRef.current = true

    const container = scrollRef.current
    const track = trackRef.current
    const card = e.currentTarget
    if (!container || !track || !card) return

    const cardRect = card.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    const cardCenter = cardRect.left + cardRect.width / 2
    const containerCenter = containerRect.left + containerRect.width / 2

    const style = getComputedStyle(track)
    const matrix = new DOMMatrixReadOnly(style.transform)
    const currentX = matrix.m41

    const centerOffset = cardCenter - containerCenter
    track.style.transform = `translateX(${currentX - centerOffset}px)`
  }

  const handleMouseLeave = () => {
    const track = trackRef.current
    if (track) {
      const style = getComputedStyle(track)
      const matrix = new DOMMatrixReadOnly(style.transform)
      posRef.current = matrix.m41
    }
    pausedRef.current = false
  }

  return (
    <SectionLayout id={SECTION_IDS.projects} className="bg-dark-900">
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Portfolio
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Featured <span className="text-gradient">Projects</span>
        </h2>
      </AnimatedSection>

      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300',
              active === cat
                ? 'bg-accent-600 text-white'
                : 'glass glass-hover text-dark-300',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="project-scroll"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={trackRef} className="project-track">
          {[...filtered, ...filtered, ...filtered].map((project, i) => (
            <div key={`${project.id}-${i}`} className="project-card-wrapper">
              <div className="project-card-bg" />
              <div className="project-card-cover">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-cover-img"
                  loading="lazy"
                  onError={e => {
                    const img = e.target as HTMLImageElement
                    img.style.display = 'none'
                    const fallback = img.nextElementSibling
                    if (fallback) fallback.classList.remove('hidden')
                  }}
                />
                <div className="project-cover-fallback hidden">
                  <ImageIcon size={32} className="text-dark-500" />
                </div>
              </div>
              <div className="project-card">
                <div className="project-content">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="project-tech-tag">
                        {tech}
                      </span>
                    ))}
                    {project.featured && (
                      <span className="project-featured-tag">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="flex items-center gap-4 mt-auto pt-3 border-t border-dark-700">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <GithubIcon size={16} /> Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}
