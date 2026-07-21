import { lazy, Suspense, useEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import gsap from 'gsap'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { siteConfig } from '@/config/site'
import { SECTION_IDS } from '@/constants'

const Scene3D = lazy(() => import('@/components/three/Scene3D'))

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const taglineRef = useRef<HTMLParagraphElement>(null!)
  const buttonsRef = useRef<HTMLDivElement>(null!)
  const socialsRef = useRef<HTMLDivElement>(null!)
  const arrowRef = useRef<HTMLButtonElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(containerRef.current,
      { opacity: 0, scale: 0.85, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2 },
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.6',
    )
    .fromTo(taglineRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.5',
    )
    .fromTo(buttonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4',
    )
    .fromTo(socialsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3',
    )
    .fromTo(arrowRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.2',
    )
  }, [])

  const scrollToAbout = () => {
    document.getElementById(SECTION_IDS.about)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <SectionLayout
      id={SECTION_IDS.hero}
      className="relative min-h-screen flex items-center mesh-gradient"
      containerClassName="w-full"
    >
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center text-center gap-8"
      >
        <p
          ref={subtitleRef}
          className="text-sm font-mono text-accent-400 tracking-widest uppercase"
        >
          {siteConfig.title}
        </p>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="text-gradient">{siteConfig.name.split(' ')[0]}</span>
          <br />
          <span>{siteConfig.name.split(' ').slice(1).join(' ')}</span>
        </h1>

        <p
          ref={taglineRef}
          className="max-w-xl text-lg text-dark-300 leading-relaxed"
        >
          {siteConfig.tagline}
        </p>

        <div ref={buttonsRef} className="flex items-center gap-4">
          <button
            onClick={scrollToAbout}
            className="px-8 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
          >
            Explore My Work
          </button>
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 glass glass-hover rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Resume
          </a>
        </div>

        <div ref={socialsRef} className="flex items-center gap-6 mt-4">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block" aria-label="GitHub">
            <GithubIcon size={20} />
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block" aria-label="LinkedIn">
            <LinkedinIcon size={20} />
          </a>
          <a href={siteConfig.twitter} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block" aria-label="Twitter">
            <TwitterIcon size={20} />
          </a>
        </div>
      </div>

      <button
        ref={arrowRef}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-400 hover:text-text-primary transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} className="animate-bounce" />
      </button>
    </SectionLayout>
  )
}
