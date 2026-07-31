import { useEffect, useRef, useCallback } from 'react'
import { X, ExternalLink, Lightbulb, Target, Layers, Wrench, BarChart3, GitBranch } from 'lucide-react'
import { GithubIcon } from '@/components/ui/SocialIcon'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/types'

interface ProjectDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

function SectionHeader({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-accent-400" />
      <p className="text-xs font-mono text-accent-400 tracking-widest uppercase">{label}</p>
    </div>
  )
}

function FeatureItem({ text, index }: { text: string; index: number }) {
  return (
    <motion.li
      className="flex items-start gap-3 text-sm text-dark-200 leading-relaxed"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-accent-400" />
      <span>{text}</span>
    </motion.li>
  )
}

export default function ProjectDetailsModal({ isOpen, onClose, project }: ProjectDetailsModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const atTop = scrollTop === 0 && e.deltaY < 0
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0
    if (!atTop && !atBottom) {
      e.stopPropagation()
    }
  }, [])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] glass rounded-2xl overflow-hidden border border-white/10 flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onWheel={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-dark-900/90 backdrop-blur-xl">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-text-primary truncate">{project.title}</h3>
                <p className="text-xs sm:text-sm text-dark-400 mt-0.5 truncate">{project.tagline}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ml-3"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div
              ref={scrollRef}
              onWheel={handleWheel}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
            >
              {/* Overview */}
              <div>
                <SectionHeader icon={Layers} label="Overview" />
                <p className="text-sm text-dark-200 leading-relaxed">{project.longDescription}</p>
              </div>

              {/* Problem Statement */}
              <div>
                <SectionHeader icon={Target} label="Problem Statement" />
                <div className="relative pl-4 border-l-2 border-accent-500/40">
                  <p className="text-sm text-dark-200 leading-relaxed italic">{project.problemStatement}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <SectionHeader icon={Wrench} label="Tech Stack" />
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-600/20 text-accent-300 border border-accent-400/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <SectionHeader icon={Lightbulb} label="Key Features" />
                <ul className="space-y-2">
                  {project.keyFeatures.map((feature, idx) => (
                    <FeatureItem key={idx} text={feature} index={idx} />
                  ))}
                </ul>
              </div>

              {/* My Role */}
              <div>
                <SectionHeader icon={GitBranch} label="My Role" />
                <p className="text-sm text-dark-200 leading-relaxed">{project.myRole}</p>
              </div>

              {/* Challenges & Solutions */}
              <div>
                <SectionHeader icon={Wrench} label="Challenges & Solutions" />
                <div className="space-y-4">
                  {project.challengesAndSolutions.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="glass rounded-xl p-4 border border-white/5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">!</span>
                        <p className="text-sm text-dark-200 leading-relaxed font-medium">{item.challenge}</p>
                      </div>
                      <div className="flex items-start gap-3 ml-0 sm:ml-9">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span>
                        <p className="text-sm text-dark-300 leading-relaxed">{item.solution}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Results / Impact */}
              <div>
                <SectionHeader icon={BarChart3} label="Results / Impact" />
                <ul className="space-y-2">
                  {project.resultsAndImpact.map((result, idx) => (
                    <FeatureItem key={idx} text={result} index={idx} />
                  ))}
                </ul>
              </div>

              {/* Architecture */}
              <div>
                <SectionHeader icon={Layers} label="Architecture" />
                <div className="glass rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-dark-300 leading-relaxed font-mono">{project.architecture}</p>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap gap-3 pt-2 pb-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium glass border border-white/10 text-dark-200 hover:text-accent-400 hover:border-accent-400/30 transition-all duration-300"
                  >
                    <GithubIcon size={14} /> View Source
                  </a>
                )}
                {project.liveUrl && project.liveUrl !== '/ai_portfolio/not-live' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-accent-600 text-white hover:bg-accent-500 transition-all duration-300"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
