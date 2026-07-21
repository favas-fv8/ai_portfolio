import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  markers?: boolean
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null!)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { from, to, start = 'top 85%', end = 'top 20%', scrub, markers } = options

    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 40,
        ...from,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          end,
          toggleActions: 'play none none reverse',
          markers,
          ...(scrub !== undefined ? { scrub } : {}),
        },
        ...to,
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [options.from, options.to, options.start, options.end, options.scrub, options.markers])

  return ref
}
