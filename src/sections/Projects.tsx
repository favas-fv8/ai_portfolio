import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/SocialIcon'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import projectsData from '@/data/projects.json'
import { cn } from '@/utils/cn'

const categories = ['all', 'fullstack', 'frontend', 'backend'] as const

export default function Projects() {
  const [active, setActive] = useState<string>('all')

  const filtered = active === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === active)

  return (
    <SectionLayout id={SECTION_IDS.projects}>
      <div className="text-center mb-16">
        <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
          Portfolio
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          Featured <span className="text-gradient">Projects</span>
        </h2>
      </div>

      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300',
              active === cat
                ? 'bg-accent-600 text-white'
                : 'glass glass-hover text-dark-300',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map(project => (
          <div
            key={project.id}
            className="glass rounded-2xl overflow-hidden group hover:bg-surface-hover transition-all duration-500"
          >
            <div className="aspect-video bg-dark-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-dark-500 text-sm font-mono">{project.title}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {project.technologies.slice(0, 4).map(tech => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-full bg-dark-800 text-dark-300">
                    {tech}
                  </span>
                ))}
                {project.featured && (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent-500/20 text-accent-400">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-dark-400 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-dark-300 hover:text-text-primary transition-colors"
                  >
                    <GithubIcon size={16} /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-dark-300 hover:text-text-primary transition-colors"
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}
