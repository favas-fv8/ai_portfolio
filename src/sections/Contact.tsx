import { Mail, MapPin, Phone, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import { siteConfig } from '@/config/site'
import socialsData from '@/data/socials.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Github: GithubIcon, Linkedin: LinkedinIcon, Twitter: TwitterIcon, Mail,
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={copy} className="text-dark-400 hover:text-accent-400 transition-colors" aria-label="Copy to clipboard">
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  )
}

export default function Contact() {
  return (
    <SectionLayout id={SECTION_IDS.contact}>
      <AnimatedSection className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Contact
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Get In <span className="text-gradient">Touch</span>
        </h2>
      </AnimatedSection>

      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-accent-400" />
                <span className="text-sm">{siteConfig.email}</span>
              </div>
              <CopyButton text={siteConfig.email} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-accent-400" />
                <span className="text-sm">{siteConfig.phone}</span>
              </div>
              <CopyButton text={siteConfig.phone} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-accent-400" />
                <span className="text-sm">{siteConfig.location}</span>
              </div>
              <span className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400">
                  {siteConfig.available ? 'Available' : 'Busy'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-8 pt-8 border-t border-border">
            {socialsData.map(social => {
              const Icon = iconMap[social.icon]
              return Icon ? (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-accent-400 transition-colors"
                  aria-label={social.name}
                >
                  <Icon size={22} />
                </a>
              ) : null
            })}
          </div>
        </div>
      </div>
    </SectionLayout>
  )
}
