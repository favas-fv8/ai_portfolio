import { Download, Award, Briefcase, Code, Users } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import profile from '@/data/profile.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

const stats = [
  { icon: Briefcase, label: 'Years Experience', value: profile.experience },
  { icon: Code, label: 'Projects Completed', value: profile.projects },
  { icon: Users, label: 'Happy Clients', value: profile.clients },
  { icon: Award, label: 'Technologies', value: profile.technologies },
]

export default function About() {
  return (
    <SectionLayout id={SECTION_IDS.about}>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <AnimatedSection>
          <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
            About Me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Turning Ideas Into
            <span className="text-gradient"> Digital Reality</span>
          </h2>
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="text-dark-300 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 mt-4 glass glass-hover rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Download size={16} />
            Download Resume
          </a>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 text-center hover:bg-surface-hover transition-colors duration-300">
                <stat.icon className="mx-auto mb-3 text-accent-400" size={28} />
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stat.value}+
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}
