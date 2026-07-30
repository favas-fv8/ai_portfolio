import { useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import experienceData from '@/data/experience.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

function ExperienceCard({ exp, index }: { exp: typeof experienceData[number]; index: number }) {
  // once: true for the card entrance animation (slides in once)
  const cardRef = useRef<HTMLDivElement>(null)
  const isCardVisible = useInView(cardRef, { once: true, margin: '-80px' })

  // once: false — re-evaluates every time the card enters/leaves the viewport
  // The dot glows only while this card is the one in view
  const dotRef = useRef<HTMLDivElement>(null)
  const isDotActive = useInView(dotRef, {
    once: false,
    margin: '-20% 0px -50% 0px', // card is "active" when its top half is in the middle of the screen
  })

  return (
    <motion.div
      ref={cardRef}
      className="relative pl-12"
      initial={{ opacity: 0, x: -40 }}
      animate={isCardVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Timeline dot anchor — placed so the InView sensor sits at the card top */}
      <div ref={dotRef} className="absolute left-[17px] top-4 w-5 h-5 pointer-events-none">
        {/* Outer ripple ring — only shown when active */}
        <AnimatePresence>
          {isDotActive && (
            <motion.span
              key="ripple"
              className="absolute inset-0 rounded-full border border-accent-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Second ripple ring — offset for layered pulse effect */}
        <AnimatePresence>
          {isDotActive && (
            <motion.span
              key="ripple2"
              className="absolute inset-0 rounded-full border border-accent-500/50"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, delay: 0.35, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* The dot itself */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 z-10"
          animate={
            isDotActive
              ? {
                  backgroundColor: 'rgb(99 102 241)',   // accent-500 filled
                  borderColor: 'rgb(129 140 248)',       // accent-400
                  boxShadow: '0 0 0 4px rgba(99,102,241,0.25), 0 0 18px rgba(99,102,241,0.6)',
                  scale: 1.15,
                }
              : {
                  backgroundColor: 'transparent',        // hollow
                  borderColor: 'rgb(59 59 69)',           // dark-600
                  boxShadow: '0 0 0 0px rgba(99,102,241,0)',
                  scale: 1,
                }
          }
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Card */}
      <div className="group relative glass rounded-2xl p-6 overflow-hidden border border-white/5 hover:border-accent-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
        {/* Sweep shimmer on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{exp.role}</h3>
            <p className="text-sm text-accent-400 font-medium">{exp.company}</p>
          </div>
          <span className="text-xs text-dark-400 font-mono bg-dark-800/60 px-3 py-1 rounded-full border border-white/5">
            {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
          </span>
        </div>

        <p className="text-sm text-dark-300 mb-4 leading-relaxed">{exp.description}</p>

        {exp.achievements.length > 0 && (
          <ul className="space-y-2 mb-4">
            {exp.achievements.map((a, j) => (
              <li key={j} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="text-accent-400 mt-0.5 shrink-0">▸</span>
                {a}
              </li>
            ))}
          </ul>
        )}

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {exp.technologies.map(tech => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-full bg-accent-900/40 text-accent-300 border border-accent-800/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <SectionLayout id={SECTION_IDS.experience} className="bg-dark-900">
      {/* Section header */}
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Career
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Project <span className="text-gradient">Experience</span>
        </h2>
      </AnimatedSection>

      {/* Timeline */}
      <div className="relative max-w-3xl mx-auto">
        {/* Static vertical line */}
        <div className="absolute left-[24px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-500/60 via-accent-700/30 to-transparent" />

        <div className="space-y-10">
          {experienceData.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}
