import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import experienceData from '@/data/experience.json'
import { cn } from '@/utils/cn'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Experience() {
  return (
    <SectionLayout id={SECTION_IDS.experience}>
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Career
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Work <span className="text-gradient">Experience</span>
        </h2>
      </AnimatedSection>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-dark-700" />

        <div className="space-y-12">
          {experienceData.map((exp, i) => (
            <AnimatedSection key={exp.id} delay={i * 0.1}>
              <div className="relative pl-12">
                <div
                  className={cn(
                    'absolute left-3 top-1.5 w-3 h-3 rounded-full border-2',
                    exp.current
                      ? 'bg-accent-500 border-accent-500 shadow-glow-sm'
                      : 'bg-dark-900 border-dark-600',
                  )}
                />
                <div className="glass rounded-2xl p-6 glass-hover">
                  <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.role}</h3>
                      <p className="text-sm text-accent-400">{exp.company}</p>
                    </div>
                    <span className="text-xs text-dark-400 font-mono">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400 mb-4">{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {exp.achievements.map((a, j) => (
                        <li key={j} className="text-sm text-dark-300 flex items-start gap-2">
                          <span className="text-accent-400 mt-1">&#x2022;</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <span key={tech} className="text-xs px-2 py-1 rounded-full bg-dark-800 text-dark-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}
