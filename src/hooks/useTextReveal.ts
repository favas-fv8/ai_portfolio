import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealOptions {
  type?: 'chars' | 'words' | 'lines'
  stagger?: number
  duration?: number
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  start?: string
  scrub?: boolean | number
}

export function useTextReveal<T extends HTMLElement>(
  options: TextRevealOptions = {},
) {
  const ref = useRef<T>(null!)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      type = 'chars',
      stagger = 0.02,
      duration = 0.6,
      from = {},
      to = {},
      start = 'top 85%',
      scrub,
    } = options

    const split = new SplitType(el, { types: type })

    const elements = type === 'chars'
      ? split.chars
      : type === 'words'
        ? split.words
        : split.lines

    if (!elements || elements.length === 0) return

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: type === 'lines' ? 40 : 20,
        rotateX: -30,
        ...from,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none reverse',
          ...(scrub !== undefined ? { scrub } : {}),
        },
        ...to,
      },
    )

    return () => {
      split.revert()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [options.type, options.stagger, options.duration, options.from, options.to, options.start, options.scrub])

  return ref
}
