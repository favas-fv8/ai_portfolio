import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/ui/SocialIcon'
import { siteConfig } from '@/config/site'
import socialsData from '@/data/socials.json'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Github: GithubIcon, Linkedin: LinkedinIcon, Twitter: TwitterIcon, Mail,
}

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <button
          onClick={scrollToTop}
          className="text-xl font-bold tracking-wider text-gradient"
          aria-label="Back to top"
        >
          MF
        </button>

        <div className="flex items-center gap-4">
          {socialsData.map(social => {
            const Icon = iconMap[social.icon]
            return Icon ? (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-accent-400 transition-colors duration-300"
                aria-label={social.name}
              >
                <Icon size={20} />
              </a>
            ) : null
          })}
        </div>

        <p className="text-sm text-dark-400">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
