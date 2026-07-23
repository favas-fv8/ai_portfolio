import { Globe, Palette, Server, Lightbulb } from 'lucide-react'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import servicesData from '@/data/services.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, Palette, Server, Lightbulb,
}

export default function Services() {
  return (
    <SectionLayout id={SECTION_IDS.services} className="bg-dark-950">
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          What I Do
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Services & <span className="text-gradient">Solutions</span>
        </h2>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {servicesData.map((service, i) => {
          const Icon = iconMap[service.icon]
          return (
            <AnimatedSection key={service.id} delay={i * 0.1}>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="mb-4" style={{ color: 'var(--color-accent-400)' }}>
                      {Icon && <Icon size={40} />}
                    </div>
                    <p className="flip-title">{service.title}</p>
                    <p className="flip-hint">Hover Me</p>
                  </div>
                  <div className="flip-card-back">
                    <p className="flip-title">{service.title}</p>
                    <p className="flip-desc">{service.description}</p>
                    <ul className="flip-features">
                      {service.features.map(feature => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )
        })}
      </div>
    </SectionLayout>
  )
}
