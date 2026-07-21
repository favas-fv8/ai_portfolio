import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/utils/cn'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const start = delay > 0.2 ? 'top 85%' : 'top 90%'

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        {
          opacity: 0,
          scale: 0.65,
          rotateX: 30,
          y: 80,
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start,
            end: 'top 25%',
            scrub: 1.2,
          },
        },
      )
    })

    return () => {
      ctx.revert()
    }
  }, [delay])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
