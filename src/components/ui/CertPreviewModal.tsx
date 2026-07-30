import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CertPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileUrl: string
  title: string
}

export default function CertPreviewModal({ isOpen, onClose, fileUrl, title }: CertPreviewModalProps) {
  const isPdf = fileUrl.endsWith('.pdf')

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
            className="relative w-full max-w-2xl max-h-[80vh] glass rounded-2xl overflow-hidden border border-white/10"
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
            <div className="p-4 overflow-auto max-h-[calc(80vh-60px)]">
              {isPdf ? (
                <embed src={fileUrl} type="application/pdf" className="w-full h-[70vh] rounded-lg" />
              ) : (
                <img src={fileUrl} alt={title} className="w-full h-auto rounded-lg" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
