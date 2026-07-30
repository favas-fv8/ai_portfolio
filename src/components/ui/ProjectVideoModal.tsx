import { useRef, useState, useEffect } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectVideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title: string
}

export default function ProjectVideoModal({ isOpen, onClose, videoUrl, title }: ProjectVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrent] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [showControls, setShowControls] = useState(true)
  const [showMore, setShowMore] = useState(false)

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    v.paused ? v.play() : v.pause()
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const skip = (sec: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + sec))
  }

  const toggleFullscreen = (el: HTMLDivElement) => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => {
      setProgress((v.currentTime / v.duration) * 100 || 0)
      setCurrent(fmt(v.currentTime))
    }
    const onMeta = () => setDuration(fmt(v.duration))
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      const v = videoRef.current
      if (v) { v.pause(); v.currentTime = 0 }
      setPlaying(false)
      setProgress(0)
      setCurrent('0:00')
      setDuration('0:00')
      setShowMore(false)
    }
  }, [isOpen])

  const startHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setShowControls(true)
    hideTimerRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseMove={startHideTimer}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl glass rounded-2xl overflow-hidden border border-white/10"
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

            <div
              className="relative bg-black group"
              onMouseMove={startHideTimer}
              onMouseLeave={() => setShowControls(true)}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full aspect-video object-contain"
                onClick={togglePlay}
              />

              {!playing && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Play size={28} className="text-white ml-1" />
                  </div>
                </button>
              )}

              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="px-4 pt-2">
                  <div
                    className="w-full h-1 bg-white/20 rounded-full cursor-pointer group/progress"
                    onClick={e => {
                      const v = videoRef.current
                      if (!v) return
                      const rect = e.currentTarget.getBoundingClientRect()
                      v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration
                    }}
                  >
                    <div
                      className="h-full bg-accent-400 rounded-full relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-400 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors">
                      {playing ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button onClick={() => skip(-5)} className="text-white/80 hover:text-white transition-colors">
                      <SkipBack size={16} />
                    </button>
                    <button onClick={() => skip(5)} className="text-white/80 hover:text-white transition-colors">
                      <SkipForward size={16} />
                    </button>
                    <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span className="text-xs text-white/60 font-mono">{currentTime} / {duration}</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {showMore && (
                      <div className="absolute bottom-full right-0 mb-2 w-40 glass rounded-lg border border-white/10 overflow-hidden z-10">
                        <button
                          onClick={() => { skip(-10); setShowMore(false) }}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition-colors"
                        >
                          Skip Back 10s
                        </button>
                        <button
                          onClick={() => { skip(10); setShowMore(false) }}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition-colors"
                        >
                          Skip Forward 10s
                        </button>
                        <button
                          onClick={() => { if (videoRef.current) videoRef.current.playbackRate = 1; setShowMore(false) }}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition-colors"
                        >
                          Normal Speed
                        </button>
                        <button
                          onClick={() => { if (videoRef.current) videoRef.current.playbackRate = 1.5; setShowMore(false) }}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition-colors"
                        >
                          1.5x Speed
                        </button>
                        <button
                          onClick={() => { if (videoRef.current) videoRef.current.playbackRate = 2; setShowMore(false) }}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition-colors"
                        >
                          2x Speed
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => toggleFullscreen(videoRef.current?.parentElement?.parentElement as HTMLDivElement)}
                      className="text-white/80 hover:text-white transition-colors ml-2"
                    >
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
