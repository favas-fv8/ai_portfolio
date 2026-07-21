import { GraduationCap } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import educationData from '@/data/education.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Education() {
  return (
    <SectionLayout id={SECTION_IDS.education}>
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Education
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Academic <span className="text-gradient">Background</span>
        </h2>
      </AnimatedSection>

      <div className="max-w-3xl mx-auto space-y-6">
        {educationData.map((edu, i) => (
          <AnimatedSection key={edu.id} delay={i * 0.1}>
            <div className="glass rounded-2xl p-6 glass-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400 shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm text-accent-400 mb-1">{edu.institution}</p>
                  <p className="text-xs text-dark-400 font-mono mb-3">
                    {edu.startDate} — {edu.endDate} {edu.grade && `| ${edu.grade}`}
                  </p>
                  {edu.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {edu.achievements.map((a, i) => (
                        <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                          <span className="text-accent-400 mt-1">&#x2022;</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </SectionLayout>
  )
}
