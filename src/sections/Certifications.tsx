import { Award, ExternalLink } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import certificationsData from '@/data/certifications.json'

export default function Certifications() {
  return (
    <SectionLayout id={SECTION_IDS.certifications}>
      <div className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Certifications
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Professional <span className="text-gradient">Credentials</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificationsData.map(cert => (
          <div key={cert.id} className="glass rounded-2xl p-6 glass-hover group">
            <div className="mb-4 text-accent-400">
              <Award size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-1">{cert.title}</h3>
            <p className="text-sm text-accent-400 mb-1">{cert.issuer}</p>
            <p className="text-xs text-dark-400 font-mono mb-4">{cert.date}</p>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-dark-300 hover:text-accent-400 transition-colors"
              >
                View Credential <ExternalLink size={14} />
              </a>
            )}
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}
