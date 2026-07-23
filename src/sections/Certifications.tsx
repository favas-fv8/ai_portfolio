import { Award, ExternalLink } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import certificationsData from '@/data/certifications.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

const themes = ['indigo', 'purple', 'cyan', 'indigo', 'purple']

export default function Certifications() {
  return (
    <SectionLayout id={SECTION_IDS.certifications} className="bg-dark-900">
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Certifications
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Professional <span className="text-gradient">Credentials</span>
        </h2>
      </AnimatedSection>

      <div className="cert-scroll flex gap-12 overflow-x-auto pb-4 px-4" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {certificationsData.map((cert, i) => {
          const theme = themes[i % themes.length]
          return (
            <AnimatedSection key={cert.id} delay={i * 0.1}>
              <div className={`cert-card ${theme}`} style={{ scrollSnapAlign: 'start' }}>
                <div className="top-strip">
                  <span>{cert.issuer}</span>
                </div>

                <div className="badge">
                  <div className="badge-inner">{String(i + 1).padStart(2, '0')}</div>
                </div>

                <div className="content">
                  <div className="icon-wrap">
                    <Award size={40} />
                  </div>

                  <h3>{cert.title}</h3>

                  <p className="date">{cert.date}</p>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="credential-link"
                    >
                      View Credential <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="layer layer1" />
                <div className="layer layer2" />
              </div>
            </AnimatedSection>
          )
        })}
      </div>
    </SectionLayout>
  )
}
