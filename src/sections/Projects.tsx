import { useState, useRef, useEffect, useCallback } from 'react'
import { ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
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

  const filtered = active === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === active)

  const scrollBy = useCallback((dir: number) => {
    const track = trackRef.current
    if (!track) return
    const oneSet = track.scrollWidth / 3
    const cardWidth = 340
    const gap = 32
    const step = (cardWidth + gap) * dir
    posRef.current += step
    if (posRef.current < -oneSet) posRef.current += oneSet
    if (posRef.current > 0) posRef.current -= oneSet
    track.style.transform = `translateX(${posRef.current}px)`
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    posRef.current = 0
    track.style.transform = 'translateX(0px)'
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

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [filtered])

  const handleMouseEnter = () => {
    pausedRef.current = true
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
      </div>
    </SectionLayout>
  )
}
