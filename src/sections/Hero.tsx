import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { siteConfig } from '@/config/site'
import { SECTION_IDS } from '@/constants'

gsap.registerPlugin(ScrollTrigger)

const Scene3D = lazy(() => import('@/components/three/Scene3D'))
const CinematicIntro = lazy(() => import('@/components/three/CinematicIntro'))

/* ----------- Staggered text variants ----------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.2 },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

/* ----------- Animated name with letters ----------- */
function AnimatedName() {
  const name = siteConfig.name
  const parts = name.split(' ')
  const first = parts[0]
  const rest = parts.slice(1).join(' ')

  return (
    <motion.h1
      className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="text-gradient">
        {first.split('').map((ch, i) => (
          <motion.span key={`${ch}-${i}`} className="inline-block" variants={letterVariants}>
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </span>
      <br />
      <span>
        {rest.split('').map((ch, i) => (
          <motion.span key={`${ch}-${i}`} className="inline-block" variants={letterVariants}>
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  )
}

/* ----------- Glow orbs decoration ----------- */
function GlowOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent-500/10 blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/8 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-[150px]" />
    </div>
  )
}

/* ================================================================ */
/*  Main Hero export                                                 */
/* ================================================================ */
export default function Hero() {
  const [introDone, setIntroDone] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null!)
  const buttonsRef = useRef<HTMLDivElement>(null!)
  const socialsRef = useRef<HTMLDivElement>(null!)
  const arrowRef = useRef<HTMLButtonElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const taglineRef = useRef<HTMLParagraphElement>(null!)

  /* ---- Cinematic intro callback ---- */
  const handleIntroComplete = () => {
    setIntroDone(true)
    setTimeout(() => setShowContent(true), 100)
  }

  /* ---- GSAP entrance after intro ---- */
  useEffect(() => {
    if (!showContent) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
      .fromTo(taglineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo(buttonsRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo(socialsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo(arrowRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2')

    /* ---- Scroll-triggered parallax ---- */
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(containerRef.current, { y: progress * 80, opacity: 1 - progress * 0.5 })
      },
    })

    return () => { ScrollTrigger.getAll().forEach(st => st.kill()) }
  }, [showContent])

  const scrollToAbout = () => {
    document.getElementById(SECTION_IDS.about)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ---- Cinematic intro 3D scene ---- */}
      {!introDone && (
        <Suspense fallback={null}>
          <CinematicIntro onComplete={handleIntroComplete} />
        </Suspense>
      )}

      {/* ---- Hero content ---- */}
      <SectionLayout
        id={SECTION_IDS.hero}
        className="relative min-h-screen flex items-center mesh-gradient"
        containerClassName="w-full"
      >
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>

        <GlowOrbs />

        <div
          ref={containerRef}
          className="relative z-10 flex flex-col items-center text-center gap-8"
          style={{ opacity: showContent ? 1 : 0 }}
        >
          <motion.p
            ref={subtitleRef}
            className="text-sm font-mono text-accent-400 tracking-widest uppercase"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={showContent ? 'visible' : 'hidden'}
          >
            {siteConfig.title}
          </motion.p>

          {showContent ? <AnimatedName /> : (
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-gradient">{siteConfig.name.split(' ')[0]}</span>
              <br />
              <span>{siteConfig.name.split(' ').slice(1).join(' ')}</span>
            </h1>
          )}

          <motion.p
            ref={taglineRef}
            className="max-w-xl text-lg text-dark-300 leading-relaxed"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={showContent ? 'visible' : 'hidden'}
          >
            {siteConfig.tagline}
          </motion.p>

          <motion.div
            ref={buttonsRef}
            className="flex items-center gap-4"
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={showContent ? 'visible' : 'hidden'}
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
            ref={socialsRef}
            className="flex items-center gap-6 mt-4"
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate={showContent ? 'visible' : 'hidden'}
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
        </div>

        <button
          ref={arrowRef}
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-400 hover:text-text-primary transition-colors"
          aria-label="Scroll down"
          style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          <ArrowDown size={24} className="animate-bounce" />
        </button>
      </SectionLayout>
    </>
  )
}
