import { useState, useEffect, useRef } from 'react'
import {
  SiReact, SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss,
  SiHtml5, SiCss, SiNodedotjs, SiPython, SiPostgresql,
  SiMongodb, SiGraphql, SiFigma, SiGit, SiDocker,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import skillsData from '@/data/skills.json'
import { cn } from '@/utils/cn'
import AnimatedSection from '@/components/ui/AnimatedSection'

gsap.registerPlugin(ScrollTrigger)

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  SiReact, SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss,
  SiHtml5, SiCss, SiNodedotjs, SiPython, SiPostgresql,
  SiMongodb, SiGraphql, SiFigma, SiGit, SiDocker,
  SiAmazonwebservices: FaAws,
}

function SkillIcon({ name, color }: { name: string; color: string }) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return (
    <div
      className="w-5 h-5 flex items-center justify-center rounded shrink-0"
      style={{ backgroundColor: `${color}20` }}
    >
      <Icon size={12} color={color} />
    </div>
  )
}

const categories = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'design', label: 'Design' },
  { key: 'tools', label: 'Tools' },
] as const

export default function Skills() {
  const [active, setActive] = useState<string>('frontend')
  const barsRef = useRef<HTMLDivElement>(null!)

  const filtered = skillsData.filter(s => s.category === active)

  useEffect(() => {
    if (!barsRef.current) return
    const bars = barsRef.current.querySelectorAll('.skill-bar-fill')

    gsap.fromTo(
      bars,
      { width: '0%' },
      {
        width: (i: number) => `${filtered[i]?.level}%`,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: barsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [filtered])

  return (
    <SectionLayout id={SECTION_IDS.skills}>
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Skills & Expertise
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Technologies I <span className="text-gradient">Work With</span>
        </h2>
      </AnimatedSection>

      <div className="flex justify-center gap-2 mb-12 flex-wrap">
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

      <div ref={barsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(skill => (
          <div
            key={skill.id}
            className="glass rounded-2xl p-5 glass-hover group"
          >
            <div className="flex items-center gap-2 mb-3">
              <SkillIcon name={skill.icon} color={skill.color} />
              <span className="text-sm font-medium text-text-primary">{skill.name}</span>
              <span className="ml-auto text-xs font-mono text-dark-400">{skill.level}%</span>
            </div>
            <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <div
                className="skill-bar-fill h-full rounded-full transition-all duration-700 group-hover:shadow-glow-sm"
                style={{
                  backgroundColor: skill.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}
