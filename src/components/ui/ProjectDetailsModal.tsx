import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  longDescription: string
  technologies: string[]
}

export default function ProjectDetailsModal({ isOpen, onClose, title, longDescription, technologies }: ProjectDetailsModalProps) {
  const points = longDescription.split('. ').filter(s => s.trim())

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg max-h-[80vh] glass rounded-2xl overflow-hidden border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-text-primary truncate pr-4">{title}</h3>
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-auto max-h-[calc(80vh-60px)]">
              <ul className="space-y-3 mb-6">
                {points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-dark-200 leading-relaxed">
                    <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-accent-400" />
                    <span>{point.trim()}{!point.trim().endsWith('.') ? '.' : ''}</span>
                  </li>
                ))}
              </ul>
              <div>
                <p className="text-xs font-mono text-accent-400 tracking-widest uppercase mb-3">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-600/20 text-accent-300 border border-accent-400/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
