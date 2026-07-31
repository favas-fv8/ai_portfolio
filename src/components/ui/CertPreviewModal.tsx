import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CertPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileUrl: string
  title: string
  extraImages?: string[]
}

export default function CertPreviewModal({ isOpen, onClose, fileUrl, title, extraImages }: CertPreviewModalProps) {
  const isPdf = fileUrl.endsWith('.pdf')
  const allImages = extraImages && extraImages.length > 0 ? extraImages : [fileUrl]
  const hasMultiple = allImages.length > 1

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
            className={`relative w-full glass rounded-2xl overflow-hidden border border-white/10 ${hasMultiple ? 'max-w-4xl' : 'max-w-2xl'} max-h-[85vh]`}
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
            <div className={`p-4 overflow-auto max-h-[calc(85vh-60px)] ${hasMultiple ? 'grid grid-cols-2 gap-4' : ''}`}>
              {allImages.map((img, idx) => (
                isPdf ? (
                  <embed key={idx} src={img} type="application/pdf" className="w-full h-[70vh] rounded-lg" />
                ) : (
                  <img key={idx} src={img} alt={`${title} ${idx + 1}`} className={`w-full h-auto rounded-lg ${hasMultiple ? 'object-contain' : ''}`} />
                )
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
