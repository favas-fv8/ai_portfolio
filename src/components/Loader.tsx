import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/utils/cn'

export default function Loader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const loaderRef = useRef<HTMLDivElement>(null!)
  const textRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    gsap.fromTo(textRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' },
    )

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => setLoading(false),
      })
    }
  }, [progress])

  if (!loading) return null

  return (
    <div
      ref={loaderRef}
      className={cn(
        'fixed inset-0 z-[700] flex flex-col items-center justify-center',
        'bg-dark-950',
      )}
    >
      <div ref={textRef} className="text-4xl font-bold text-gradient mb-8 tracking-wider">
        MF
      </div>
      <div className="w-48 h-1 bg-dark-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-500 rounded-full transition-all duration-300 ease-flux"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="mt-4 text-sm text-dark-400 font-mono">
        {Math.round(progress)}%
      </span>
    </div>
  )
}
