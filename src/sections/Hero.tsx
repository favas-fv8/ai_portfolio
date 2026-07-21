import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { ArrowDown, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { siteConfig } from '@/config/site'
import { SECTION_IDS, ANIMATION } from '@/constants'

gsap.registerPlugin(ScrollTrigger)

const Scene3D = lazy(() => import('@/components/three/Scene3D'))

/* ---------- easing & duration constants ---------- */
const EASE = ANIMATION.easing.easeOut

/* ---------- Framer Motion variants ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.3 },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: 0.3 + i * 0.12, ease: EASE },
  }),
}

/* ---------- Animated name ---------- */
function AnimatedName() {
  const [first, ...rest] = siteConfig.name.split(' ')
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
        {rest.join(' ').split('').map((ch, i) => (
          <motion.span key={`${ch}-${i}`} className="inline-block" variants={letterVariants}>
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  )
}

/* ---------- Glowing orbs ---------- */
function GlowOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent-500/10 blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/8 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-[150px]" />
    </div>
  )
}

/* ---------- Floating decorative elements ---------- */
function FloatingElements() {
  const ref = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = ref.current.querySelectorAll('.float-el')
      els.forEach((el, i) => {
        gsap.to(el, {
          y: `${[-20, 15, -25, 20][i % 4]}px`,
          x: `${[10, -15, 20, -10][i % 4]}px`,
          rotate: `${[-5, 8, -10, 6][i % 4]}`,
          duration: 4 + (i * 0.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="float-el absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-accent-400/30" />
      <div className="float-el absolute top-[30%] right-[15%] w-3 h-3 rounded-full bg-purple-400/20" />
      <div className="float-el absolute bottom-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-accent-300/25" />
      <div className="float-el absolute bottom-[35%] right-[10%] w-2.5 h-2.5 rounded-full bg-indigo-400/20" />
    </div>
  )
}

/* ================================================================ */
/*  IMAGE CINEMATIC INTRO                                            */
/* ================================================================ */
const IMG_PATH = '/ai_portfolio/images/person_lap.png'

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const imgRef = useRef<HTMLImageElement>(null!)
  const overlayRef = useRef<HTMLDivElement>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const completed = useRef(false)

  /* ---- GSAP timeline ---- */
  useEffect(() => {
    const img = imgRef.current
    const wrapper = wrapperRef.current
    if (!img || !wrapper) return

    /* ---------- breathing ambient ---------- */
    gsap.to(img, {
      scale: 1.015,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    /* ---------- main zoom timeline ---------- */
    const tl = gsap.timeline({
      onComplete: () => {
        completed.current = true
        onComplete()
      },
    })

    tl.set(img, { transformOrigin: '52% 38%', willChange: 'transform' })
      .to(img, {
        scale: 1.8,
        duration: 5,
        ease: 'power2.inOut',
      }, 1.5)
      .to(img, {
        scale: 4.2,
        duration: 4,
        ease: 'power3.in',
      }, '-=0.5')

    /* ---------- vignette fade-out ---------- */
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut',
    }, '-=2')

    /* ---------- parallax mouse ---------- */
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.04
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.04
    }
    window.addEventListener('mousemove', onMouse)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      tl.kill()
    }
  }, [onComplete])

  /* ---- subtle breathing frame via rAF ---- */
  useEffect(() => {
    let id: number
    const tick = () => {
      if (!completed.current && imgRef.current) {
        imgRef.current.style.setProperty('--mx', `${mouse.current.x}px`)
        imgRef.current.style.setProperty('--my', `${mouse.current.y}px`)
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[650] overflow-hidden bg-dark-950"
    >
      {/* ---- image ---- */}
      <img
        ref={imgRef}
        src={IMG_PATH}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: 'scale(1) translate(var(--mx, 0px), var(--my, 0px))',
          willChange: 'transform',
        }}
        draggable={false}
      />

      {/* ---- gradient overlay ---- */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 52% 38%, transparent 30%, rgba(10,10,15,0.85) 100%)
          `,
        }}
      />

      {/* ---- bottom hint ---- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown
          size={20}
          className="text-white/30 animate-bounce"
        />
      </div>
    </div>
  )
}

/* ================================================================ */
/*  MAIN HERO                                                       */
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

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true)
    requestAnimationFrame(() => setShowContent(true))
  }, [])

  /* ---- GSAP entrance after intro ---- */
  useEffect(() => {
    if (!showContent) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(containerRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .fromTo(taglineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo(buttonsRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo(socialsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo(arrowRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2')

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        gsap.set(containerRef.current, {
          y: self.progress * 80,
          opacity: 1 - self.progress * 0.5,
        })
      },
    })

    return () => { tl.kill(); st.kill() }
  }, [showContent])

  const scrollToAbout = () => {
    document.getElementById(SECTION_IDS.about)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ---- cinematic intro ---- */}
      {!introDone && <CinematicIntro onComplete={handleIntroComplete} />}

      {/* ---- hero content ---- */}
      <SectionLayout
        id={SECTION_IDS.hero}
        className="relative min-h-screen flex items-center mesh-gradient"
        containerClassName="w-full"
      >
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>

        <GlowOrbs />
        <FloatingElements />

        <div
          ref={containerRef}
          className="relative z-10 flex flex-col items-center text-center gap-8"
          style={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.92 }}
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
            {([
              { href: siteConfig.github, label: 'GitHub', Icon: GithubIcon },
              { href: siteConfig.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
              { href: siteConfig.twitter, label: 'Twitter', Icon: TwitterIcon },
              { href: siteConfig.instagram, label: 'Instagram', Icon: InstagramIcon },
            ] as const).map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-dark-400 hover:text-accent-400 transition-colors hover:scale-110 inline-block"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
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
