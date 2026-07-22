import { useState, useRef, useCallback } from 'react'
import {
  SiReact, SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss,
  SiHtml5, SiCss, SiNodedotjs, SiPython, SiPostgresql,
  SiMongodb, SiGraphql, SiFigma, SiGit, SiDocker,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import skillsData from '@/data/skills.json'
import { cn } from '@/utils/cn'
import AnimatedSection from '@/components/ui/AnimatedSection'

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  SiReact, SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss,
  SiHtml5, SiCss, SiNodedotjs, SiPython, SiPostgresql,
  SiMongodb, SiGraphql, SiFigma, SiGit, SiDocker,
  SiAmazonwebservices: FaAws,
}

const categories = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'design', label: 'Design' },
  { key: 'tools', label: 'Tools' },
] as const

const ringRadius = 68
const ringCircumference = 2 * Math.PI * ringRadius
const cardSize = 160

function SkillCard({ skill, index }: { skill: typeof skillsData[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null!)
  const ringRef = useRef<SVGCircleElement>(null!)
  const counterRef = useRef({ value: 0 })
  const pulseRef = useRef<HTMLDivElement>(null!)
  const hoveredRef = useRef(false)
  const [hovered, setHovered] = useState(false)
  const [displayedLevel, setDisplayedLevel] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mag, setMag] = useState({ x: 0, y: 0 })

  const Icon = iconMap[skill.icon]
  if (!Icon) return null

  const floatDuration = 4 + (index % 3)
  const floatDelay = index * 0.15

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !hoveredRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const normX = dx / (rect.width / 2)
    const normY = dy / (rect.height / 2)
    setTilt({ x: -normY * 12, y: normX * 12 })
    setMag({ x: normX * 6, y: normY * 6 })
  }, [])

  const handleMouseEnter = useCallback(() => {
    hoveredRef.current = true
    setHovered(true)

    const targetOffset = ringCircumference * (1 - skill.level / 100)
    gsap.to(ringRef.current, {
      strokeDashoffset: targetOffset,
      duration: 1.3,
      ease: 'power3.out',
    })

    counterRef.current.value = 0
    gsap.to(counterRef.current, {
      value: skill.level,
      duration: 1.3,
      ease: 'power3.out',
      onUpdate: () => setDisplayedLevel(Math.round(counterRef.current.value)),
      onComplete: () => {
        if (pulseRef.current) {
          gsap.fromTo(pulseRef.current, { scale: 1 }, {
            scale: 1.12, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut',
          })
        }
      },
    })
  }, [skill.level])

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = false
    setHovered(false)
    setTilt({ x: 0, y: 0 })
    setMag({ x: 0, y: 0 })
    setDisplayedLevel(0)
    counterRef.current.value = 0
    gsap.to(ringRef.current, {
      strokeDashoffset: ringCircumference,
      duration: 0.8,
      ease: 'power3.inOut',
    })
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="will-change-transform"
        style={{
          animation: `float ${floatDuration}s ${floatDelay}s ease-in-out infinite`,
        }}
      >
        <div
          ref={cardRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-40 h-40 rounded-full cursor-pointer"
          style={{
            scale: hovered ? 1.08 : 1,
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate(${mag.x}px, ${mag.y}px)`,
            transition: 'scale 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: hovered ? 'transform' : 'auto',
          }}
        >
          <div
            className="absolute inset-0 rounded-full backdrop-blur-xl border transition-all duration-400"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: hovered ? 'blur(24px)' : 'blur(16px)',
              WebkitBackdropFilter: hovered ? 'blur(24px)' : 'blur(16px)',
              borderColor: hovered ? `${skill.color}66` : 'rgba(255,255,255,0.08)',
              boxShadow: hovered
                ? `0 0 40px ${skill.color}20, 0 8px 32px rgba(0,0,0,0.4)`
                : '0 8px 32px rgba(0,0,0,0.4)',
            }}
          />

          <div
            className="absolute -inset-4 rounded-full transition-opacity duration-500 blur-3xl pointer-events-none"
            style={{
              backgroundColor: skill.color,
              opacity: hovered ? 0.15 : 0,
            }}
          />

          <div
            className={cn(
              'absolute -inset-[2px] rounded-full transition-all duration-400 pointer-events-none',
              hovered ? 'opacity-100' : 'opacity-0',
            )}
            style={{
              background: `linear-gradient(135deg, ${skill.color}60, transparent 40%, ${skill.color}30 70%, transparent)`,
            }}
          />

          <svg
            className="absolute inset-0 w-full h-full -rotate-90 z-10"
            viewBox={`0 0 ${cardSize} ${cardSize}`}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.05))' }}
          >
            <defs>
              <linearGradient id={`ring-${skill.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={skill.color} />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <circle
              cx={cardSize / 2} cy={cardSize / 2} r={ringRadius}
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"
            />
            <circle
              ref={ringRef}
              cx={cardSize / 2} cy={cardSize / 2} r={ringRadius}
              fill="none" stroke={`url(#ring-${skill.id})`} strokeWidth="6"
              strokeDasharray={ringCircumference} strokeDashoffset={ringCircumference}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${skill.color}40)` }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div
              className="flex flex-col items-center gap-1 transition-all duration-300 pointer-events-none"
              style={{
                opacity: hovered ? 0 : 1,
                scale: hovered ? '0.75' : '1',
                transitionDelay: hovered ? '0ms' : '150ms',
              }}
            >
              <div className="relative">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: `${skill.color}18` }}
                >
                <span
                  style={{ display: 'inline-block', transform: hovered ? 'rotate(5deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                >
                  <Icon size={26} color={skill.color} />
                </span>
                </div>
                <div
                  className="absolute -inset-3 rounded-full blur-xl"
                  style={{ backgroundColor: `${skill.color}15` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-text-primary/80 text-center leading-tight">
                {skill.name}
              </span>
            </div>

            <div
              ref={pulseRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                opacity: hovered ? 1 : 0,
                scale: hovered ? '1' : '0.5',
                transition: 'opacity 0.3s ease, scale 0.3s ease',
                transitionDelay: hovered ? '100ms' : '0ms',
              }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: skill.color, filter: `drop-shadow(0 0 12px ${skill.color}40)` }}
              >
                {displayedLevel}%
              </span>
            </div>
          </div>

          <div
            className={cn(
              'absolute -inset-[6px] rounded-full border transition-all duration-700 pointer-events-none',
              hovered ? 'opacity-100' : 'opacity-0',
            )}
            style={{
              borderColor: `${skill.color}30`,
              animation: hovered ? 'border-pulse 2s ease-in-out infinite' : 'none',
            }}
          />
        </div>
      </div>

      <div
        className="text-center pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          transitionDelay: hovered ? '50ms' : '0ms',
        }}
      >
        <span className="text-sm font-medium text-text-primary">{skill.name}</span>
        <p className="text-xs font-mono text-dark-400 mt-0.5">{skill.experience}</p>
      </div>
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState<string>('all')
  const filtered = active === 'all'
    ? skillsData
    : skillsData.filter(s => s.category === active)

  return (
    <SectionLayout id={SECTION_IDS.skills} className="bg-dark-950">
      <AnimatedSection className="text-center mb-10">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Skills & Expertise
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Technologies I <span className="text-gradient">Work With</span>
        </h2>
      </AnimatedSection>

      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
              active === cat.key
                ? 'bg-accent-600 text-white'
                : 'glass glass-hover text-dark-300',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 justify-items-center">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <SkillCard skill={skill} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SectionLayout>
  )
}
