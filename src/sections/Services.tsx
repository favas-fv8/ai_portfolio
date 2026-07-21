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
    <SectionLayout id={SECTION_IDS.services}>
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
              <div className="glass rounded-2xl p-6 glass-hover group">
                <div className="mb-4 text-accent-400 group-hover:scale-110 transition-transform duration-300">
                  {Icon && <Icon size={32} />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-dark-400 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map(feature => (
                    <li key={feature} className="text-xs text-dark-300 flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">&#x2022;</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )
        })}
      </div>
    </SectionLayout>
  )
}
