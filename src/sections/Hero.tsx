import { lazy, Suspense } from 'react'
import { ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { siteConfig } from '@/config/site'
import { SECTION_IDS } from '@/constants'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const Scene3D = lazy(() => import('@/components/three/Scene3D'))

const nameContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.3,
    },
  },
}

const letterVariant = {
  hidden: { opacity: 0, y: 40, rotateX: -30 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function AnimatedName() {
  const name = siteConfig.name
  const first = name.split(' ')[0]
  const rest = name.split(' ').slice(1).join(' ')

  return (
    <motion.h1
      className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
      variants={nameContainer}
      initial="hidden"
      animate="visible"
    >
      <span className="text-gradient">
        {first.split('').map((char, i) => (
          <motion.span key={`${char}-${i}`} className="inline-block" variants={letterVariant}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
      <br />
      <span>
        {rest.split('').map((char, i) => (
          <motion.span key={`${char}-${i}`} className="inline-block" variants={letterVariant}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()

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

      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-8"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.p
          className="text-sm font-mono text-accent-400 tracking-widest uppercase"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {siteConfig.title}
        </motion.p>

        {reduced ? (
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="text-gradient">{siteConfig.name.split(' ')[0]}</span>
            <br />
            <span>{siteConfig.name.split(' ').slice(1).join(' ')}</span>
          </h1>
        ) : (
          <AnimatedName />
        )}

        <motion.p
          className="max-w-xl text-lg text-dark-300 leading-relaxed"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          className="flex items-center gap-4"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
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
        </motion.div>

        <motion.div
          className="flex items-center gap-6 mt-4"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block" aria-label="GitHub">
            <GithubIcon size={20} />
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block" aria-label="LinkedIn">
            <LinkedinIcon size={20} />
          </a>
          <a href={siteConfig.twitter} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block" aria-label="Twitter">
            <TwitterIcon size={20} />
          </a>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block" aria-label="Instagram">
            <InstagramIcon size={20} />
          </a>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-400 hover:text-text-primary transition-colors"
        aria-label="Scroll down"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <ArrowDown size={24} className="animate-bounce" />
      </motion.button>
    </SectionLayout>
  )
}
