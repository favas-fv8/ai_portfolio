import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import testimonialsData from '@/data/testimonials.json'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % testimonialsData.length)
  }, [])

  const prev = () => {
    setCurrent(prev => (prev - 1 + testimonialsData.length) % testimonialsData.length)
  }

  useEffect(() => {
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next])

  const t = testimonialsData[current]

  if (!t) return null

  return (
    <SectionLayout id={SECTION_IDS.testimonials}>
      <div className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Testimonials
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          What People <span className="text-gradient">Say</span>
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <blockquote className="text-lg text-dark-200 leading-relaxed mb-8">
            &ldquo;{t.content}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center text-sm font-semibold text-accent-400">
              {t.name.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-dark-400">{t.role}, {t.company}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prev}
            className="p-2 glass rounded-full hover:bg-surface-hover transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonialsData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-accent-500 w-6' : 'bg-dark-600'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-2 glass rounded-full hover:bg-surface-hover transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </SectionLayout>
  )
}
