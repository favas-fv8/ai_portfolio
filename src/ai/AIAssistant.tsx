'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Sparkles, X } from 'lucide-react'
import gsap from 'gsap'
import { cn } from '@/utils/cn'
import { findBestResponse, suggestedQuestions, type Message } from './engine'

/* ---------- Orbiting particles ---------- */
function OrbitalParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-accent-400"
          style={{
            animation: `orbit-particle 4s ${i * 1.2}s linear infinite`,
            opacity: 0.5,
          }}
        />
      ))}
      <style>{`
        @keyframes orbit-particle {
          0%   { transform: translate(-50%, -50%) rotate(0deg) translateX(28px) scale(1); opacity: 0.6; }
          50%  { opacity: 0.2; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(28px) scale(0.4); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

/* ---------- Glowing AI orb button ---------- */
function AIOrb({ onClick, label }: { onClick: () => void; label: string }) {
  const ref = useRef<HTMLButtonElement>(null!)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3
      gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' })
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <div className="relative">
      {/* tooltip */}
      <motion.div
        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-white/10 text-xs text-white/80 whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: 6, scale: 0.9 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
      >
        {label}
      </motion.div>

      <button
        ref={ref}
        onClick={onClick}
        className="relative w-14 h-14 rounded-full flex items-center justify-center outline-none group"
        aria-label={label}
      >
        {/* outer glow */}
        <div className="absolute inset-0 rounded-full bg-accent-500/20 animate-pulse" style={{ animationDuration: '3s' }} />

        {/* gradient orb */}
        <div
          className="absolute inset-1 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #4f46e5)',
            boxShadow: '0 0 30px rgba(99,102,241,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
            animation: 'float-orb 4s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes float-orb {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}</style>

        <Sparkles size={20} className="relative z-10 text-white drop-shadow-lg" />
        <OrbitalParticles />

        {/* hover scale */}
        <div className="absolute inset-0 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60 bg-accent-400/20 blur-xl" />
      </button>
    </div>
  )
}

/* ---------- Typing indicator (three pulsing dots) ---------- */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent-400/60"
          style={{ animation: `thinking-dot 1.2s ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes thinking-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </span>
  )
}

/* ---------- Character-by-character typing ---------- */
function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    const interval = setInterval(() => {
      idx.current++
      setDisplayed(text.slice(0, idx.current))
      if (idx.current >= text.length) {
        clearInterval(interval)
        onDone?.()
      }
    }, 15)
    return () => clearInterval(interval)
  }, [text, onDone])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-accent-400/70 ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  )
}

/* ================================================================ */
/*  MAIN COMPONENT                                                   */
/* ================================================================ */
export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI portfolio assistant. Ask me about my projects, skills, experience, or contact information.",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingText])

  useEffect(() => {
    if (open) {
      setShowTooltip(false)
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* ---- send a message ---- */
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || typing) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowSuggestions(false)
    setTyping(true)
    setTypingText('')

    await new Promise(r => setTimeout(r, 500 + Math.random() * 800))

    const response = findBestResponse(text)
    setTypingText(response)
  }, [typing])

  const onTypeDone = useCallback(() => {
    setMessages(prev => [...prev, { role: 'assistant', content: typingText }])
    setTypingText('')
    setTyping(false)
  }, [typingText])

  /* ---- close handler ---- */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {/* ---- floating orb ---- */}
      {!open && (
        <motion.div
          className="fixed bottom-6 right-6 z-[900]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {showTooltip && (
              <motion.div
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-white/10 text-xs text-white/80 whitespace-nowrap pointer-events-none"
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                Ask AI
              </motion.div>
            )}
            <AIOrb onClick={() => setOpen(true)} label="Ask AI" />
          </div>
        </motion.div>
      )}

      {/* ---- chat panel ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 z-[900] w-[380px] max-w-[calc(100vw-2rem)]"
            initial={{ scale: 0.3, opacity: 0, borderRadius: '50%' }}
            animate={{ scale: 1, opacity: 1, borderRadius: '16px' }}
            exit={{ scale: 0.3, opacity: 0, borderRadius: '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10"
              style={{
                background: 'rgba(16,16,26,0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 0 40px rgba(99,102,241,0.12), 0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {/* gradient border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  padding: '1px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.3), transparent, rgba(139,92,246,0.2))',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              {/* header */}
              <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                    <div className="absolute inset-0 rounded-full animate-pulse bg-accent-400/30" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI Assistant</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[11px] text-green-400/80">Available Now</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* messages */}
              <div className="h-[340px] overflow-y-auto p-4 space-y-3 scroll-smooth" style={{ overscrollBehavior: 'contain' }}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'text-sm leading-relaxed max-w-[88%] p-3 rounded-2xl',
                      msg.role === 'user'
                        ? 'bg-accent-600 text-white ml-auto rounded-br-md shadow-lg shadow-accent-600/20'
                        : 'bg-white/5 text-gray-200 rounded-bl-md border border-white/5',
                    )}
                  >
                    {msg.content}
                  </motion.div>
                ))}

                {/* typing message */}
                {typingText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm leading-relaxed max-w-[88%] p-3 rounded-2xl bg-white/5 text-gray-200 rounded-bl-md border border-white/5"
                  >
                    <TypewriterText text={typingText} onDone={onTypeDone} />
                  </motion.div>
                )}

                {/* thinking dots */}
                {typing && !typingText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm max-w-[88%] p-3 rounded-2xl bg-white/5 text-gray-200 rounded-bl-md border border-white/5"
                  >
                    <TypingDots />
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* suggestion chips */}
              {(showSuggestions || messages.length === 1) && !typing && (
                <div className="px-4 pb-3">
                  <p className="text-[11px] text-white/30 mb-2 uppercase tracking-wider font-medium">Quick suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.slice(0, 6).map(q => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition-all border border-white/5 hover:border-accent-500/30 hover:shadow-glow-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* input */}
              <form
                onSubmit={e => { e.preventDefault(); handleSend(input) }}
                className="relative flex items-center gap-2 px-4 py-3 border-t border-white/5"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/25 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-300',
                    input.trim() && !typing
                      ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/30 hover:bg-accent-500'
                      : 'text-white/20',
                  )}
                  aria-label="Send"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
