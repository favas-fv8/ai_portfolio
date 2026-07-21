import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const delayClass = delay > 0
    ? `zoom-reveal-delay-${Math.min(Math.round(delay / 0.1), 5)}`
    : ''

  return (
    <div
      ref={ref}
      className={cn('zoom-reveal', visible && 'visible', delayClass, className)}
    >
      {children}
    </div>
  )
}
