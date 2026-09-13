import { useState, useRef, useEffect, useCallback } from 'react'
import { ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight, Play, Info } from 'lucide-react'
import { GithubIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import projectsData from '@/data/projects.json'
import { cn } from '@/utils/cn'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ProjectDetailsModal from '@/components/ui/ProjectDetailsModal'
import ProjectVideoModal from '@/components/ui/ProjectVideoModal'

const categories = ['all', 'fullstack', 'frontend'] as const

const MANUAL_PAUSE_MS = 3000
const MANUAL_ANIMATION_MS = 600

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function ProjectCover({ project }: { project: (typeof projectsData)[number] }) {
  const [failed, setFailed] = useState(false)

  if (!project.image || project.image === '#' || failed) {
    return (
      <div className="project-cover-fallback">
        <ImageIcon size={32} className="text-dark-500" />
      </div>
    )
  }

  return (
    <img
      src={project.image}
      alt={project.title}
      className="project-cover-img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export default function Projects() {
  const [active, setActive] = useState<string>('all')
  const scrollRef = useRef<HTMLDivElement>(null!)
  const trackRef = useRef<HTMLDivElement>(null!)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const posRef = useRef(0)
  const manualHoldRef = useRef(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const manualAnimRef = useRef<number>(0)
  const [detailsProject, setDetailsProject] = useState<typeof projectsData[0] | null>(null)
  const [videoProject, setVideoProject] = useState<typeof projectsData[0] | null>(null)

  const totalCount = projectsData.length

  const getCategoryCount = (cat: string) =>
    cat === 'all' ? totalCount : projectsData.filter(p => p.category === cat).length

  const filtered = active === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === active)

  const isSingle = filtered.length <= 1

  const scrollBy = useCallback((dir: number) => {
    const track = trackRef.current
    if (!track) return
    // Hold auto-scroll for a few seconds so the manual step stays visible
    manualHoldRef.current = true
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      manualHoldRef.current = false
      resumeTimeoutRef.current = null
    }, MANUAL_PAUSE_MS)
    const oneSet = track.scrollWidth / 3
    const cardWidth = window.innerWidth < 640 ? Math.min(340, window.innerWidth * 0.85) : 340
    const gap = window.innerWidth < 640 ? 16 : 32
    // Half-card step for slower manual scrolling + smooth eased animation
    const step = ((cardWidth + gap) / 2) * dir
    if (manualAnimRef.current) cancelAnimationFrame(manualAnimRef.current)
    const start = posRef.current
    const rawTarget = start + step
    // Wrapped position is visually identical (track holds 3 copies), so we
    // animate past the boundary then snap back silently — no visible jump.
    let end = rawTarget
    if (end < -oneSet) end += oneSet
    if (end > 0) end -= oneSet
    const animateTarget = rawTarget < -oneSet || rawTarget > 0 ? rawTarget : end
    const startTime = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / MANUAL_ANIMATION_MS, 1)
      const eased = easeInOutCubic(progress)
      posRef.current = start + (animateTarget - start) * eased
      track.style.transform = `translateX(${posRef.current}px)`
      if (progress < 1) {
        manualAnimRef.current = requestAnimationFrame(animate)
      } else {
        // Snap to wrapped position (identical visuals, keeps loop range valid)
        posRef.current = end
        track.style.transform = `translateX(${posRef.current}px)`
        manualAnimRef.current = 0
      }
    }
    manualAnimRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    posRef.current = 0
    track.style.transform = 'translateX(0px)'
    if (isSingle) return
    const oneSet = track.scrollWidth / 3

    const scroll = () => {
      if (!pausedRef.current && !manualHoldRef.current) {
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
      if (manualAnimRef.current) {
        cancelAnimationFrame(manualAnimRef.current)
        manualAnimRef.current = 0
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = null
      }
      manualHoldRef.current = false
    }
  }, [filtered, isSingle])

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
      <AnimatedSection className="text-center mb-8 md:mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Portfolio
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="mt-4 text-sm font-mono text-dark-400 tracking-wide">
          <span className="text-accent-400 font-semibold">{totalCount}</span>{' '}
          {totalCount === 1 ? 'project' : 'projects'} built & shipped
        </p>
      </AnimatedSection>

      <div className="flex justify-center gap-2 mb-4 md:mb-8 flex-wrap">
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
            <span
              className={cn(
                'ml-2 rounded-full px-2 py-0.5 text-xs font-mono',
                active === cat ? 'bg-white/20 text-white' : 'bg-white/5 text-dark-400',
              )}
            >
              {getCategoryCount(cat)}
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs font-mono text-dark-500 tracking-wide mb-6 md:mb-12">
        Showing {filtered.length} of {totalCount} {totalCount === 1 ? 'project' : 'projects'}
        {active !== 'all' && <span className="capitalize"> in {active}</span>}
      </p>

      <div className="relative px-2 md:px-0">
        {!isSingle && (
          <>
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full glass text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full glass text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="project-scroll"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={trackRef}
            className="project-track"
            style={isSingle ? { margin: '0 auto', transform: 'none' } : undefined}
          >
            {(isSingle ? filtered : [...filtered, ...filtered, ...filtered]).map((project, i) => (
              <div key={`${project.id}-${i}`} className="project-card-wrapper">
                <div className="project-card-bg" />
                <div className="project-card-cover">
                  <ProjectCover project={project} />
                </div>
                <div className="project-card">
                  <div className="project-content">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="project-tech-tag">
                          {tech}
                        </span>
                      ))}

                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="flex items-center gap-4 mt-auto pt-3 border-t border-dark-700">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link project-link-tooltip"
                        >
                          <GithubIcon size={16} /> <span className="project-link-tooltip-text">Code</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target={project.liveUrl.startsWith('http') ? '_blank' : undefined}
                          rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="project-link project-link-tooltip"
                        >
                          <ExternalLink size={16} /> <span className="project-link-tooltip-text">Live Demo</span>
                        </a>
                      )}
                      <button
                        onClick={() => setVideoProject(project)}
                        className="project-link project-link-tooltip"
                      >
                        <Play size={16} /> <span className="project-link-tooltip-text">Video Record</span>
                      </button>
                      <button
                        onClick={() => setDetailsProject(project)}
                        className="project-link project-link-tooltip"
                      >
                        <Info size={16} /> <span className="project-link-tooltip-text">Details</span>
                      </button>
                      {project.liveUrl && project.liveUrl !== '/ai_portfolio/not-live' && (
                        <a
                          href={project.liveUrl}
                          target={project.liveUrl.startsWith('http') ? '_blank' : undefined}
                          rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="project-live-tag ml-auto"
                        >
                          <span className="project-live-dot" />
                          Live
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

      <ProjectDetailsModal
        isOpen={!!detailsProject}
        onClose={() => setDetailsProject(null)}
        project={detailsProject}
      />
      <ProjectVideoModal
        isOpen={!!videoProject}
        onClose={() => setVideoProject(null)}
        videoUrl={videoProject?.videoUrl || ''}
        title={videoProject?.title || ''}
      />
    </SectionLayout>
  )
}
