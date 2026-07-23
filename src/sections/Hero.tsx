import { lazy, Suspense } from 'react'
import { ArrowDown, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { siteConfig } from '@/config/site'
import { SECTION_IDS } from '@/constants'

const Scene3D = lazy(() => import('@/components/three/Scene3D'))

export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById(SECTION_IDS.about)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <SectionLayout
      id={SECTION_IDS.hero}
      className="relative min-h-screen flex items-center mesh-gradient bg-dark-950"
      containerClassName="w-full"
    >
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase">
          {siteConfig.title}
        </p>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="text-gradient">{siteConfig.name.split(' ')[0]}</span>
          <br />
          <span>{siteConfig.name.split(' ').slice(1).join(' ')}</span>
        </h1>

        <p className="max-w-xl text-lg text-dark-300 leading-relaxed">
          {siteConfig.tagline}
        </p>

        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-6 mt-4">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="icon-glow text-dark-400" aria-label="GitHub">
            <GithubIcon size={20} />
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="icon-glow text-dark-400" aria-label="LinkedIn">
            <LinkedinIcon size={20} />
          </a>
          <a href={siteConfig.twitter} target="_blank" rel="noopener noreferrer" className="icon-glow text-dark-400" aria-label="X">
            <TwitterIcon size={20} />
          </a>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="icon-glow text-dark-400" aria-label="Instagram">
            <InstagramIcon size={20} />
          </a>
          <a href={`mailto:${siteConfig.email}`} className="icon-glow text-dark-400" aria-label="Email">
            <Mail size={20} />
          </a>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-400 hover:text-text-primary transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} className="animate-bounce" />
      </button>
    </SectionLayout>
  )
}
