'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import gsap from 'gsap'
import { cn } from '@/utils/cn'
import { findBestResponse, suggestedQuestions, type Message } from './engine'

/* ---------- Lightweight markdown renderer ---------- */
/* Supports engine output: ### titles, **bold**, `badges`, [links](url),
   - points, indented sub-points, 1. numbered, > quotes, | tables | */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  // links, bold, code, italic
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*\n]+)\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      out.push(
        <a key={`${keyPrefix}-a-${k++}`} href={m[3]} target="_blank" rel="noopener noreferrer" className="chat-md-link">
          {m[2]}
        </a>,
      )
    } else if (m[4]) {
      out.push(<strong key={`${keyPrefix}-b-${k++}`} className="chat-md-strong">{m[5]}</strong>)
    } else if (m[6]) {
      out.push(<code key={`${keyPrefix}-c-${k++}`} className="chat-md-badge">{m[7]}</code>)
    } else if (m[8]) {
      out.push(<em key={`${keyPrefix}-i-${k++}`} className="chat-md-em">{m[9]}</em>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function ChatMarkdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    // table block
    if (trimmed.startsWith('|') && i + 1 < lines.length && /^\|?[\s:|-]+\|?[\s:|-]*$/.test(lines[i + 1].trim())) {
      const header = trimmed.split('|').filter(Boolean).map(s => s.trim())
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].trim().split('|').filter(Boolean).map(s => s.trim()))
        i++
      }
      blocks.push(
        <div key={key++} className="chat-md-table-wrap">
          <table className="chat-md-table">
            <thead><tr>{header.map((h, hi) => <th key={hi}>{renderInline(h, `th-${key}-${hi}`)}</th>)}</tr></thead>
            <tbody>{rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci}>{renderInline(c, `td-${key}-${ri}-${ci}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      )
      continue
    }
    if (/^###\s+/.test(trimmed)) {
      blocks.push(<h4 key={key++} className="chat-md-h">{renderInline(trimmed.replace(/^###\s+/, ''), `h-${key}`)}</h4>)
      i++
      continue
    }
    if (/^##\s+/.test(trimmed)) {
      blocks.push(<h3 key={key++} className="chat-md-h">{renderInline(trimmed.replace(/^##\s+/, ''), `h-${key}`)}</h3>)
      i++
      continue
    }
    if (/^>\s?/.test(trimmed)) {
      blocks.push(<blockquote key={key++} className="chat-md-quote">{renderInline(trimmed.replace(/^>\s?/, ''), `q-${key}`)}</blockquote>)
      i++
      continue
    }
    if (/^(\s*[-•]\s+)/.test(line)) {
      const items: ReactNode[] = []
      while (i < lines.length && /^(\s*[-•]\s+)/.test(lines[i])) {
        const m = lines[i].match(/^(\s*)[-•]\s+(.*)$/)!
        const indent = m[1].length
        items.push(
          <li key={`li-${key}-${items.length}`} className={indent >= 2 ? 'chat-md-sub' : undefined}>
            {renderInline(m[2], `li-${key}-${items.length}`)}
          </li>,
        )
        i++
      }
      blocks.push(<ul key={key++} className="chat-md-ul">{items}</ul>)
      continue
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: ReactNode[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(<li key={`ol-${key}-${items.length}`}>{renderInline(lines[i].replace(/^\s*\d+\.\s+/, ''), `ol-${key}-${items.length}`)}</li>)
        i++
      }
      blocks.push(<ol key={key++} className="chat-md-ol">{items}</ol>)
      continue
    }
    if (trimmed === '' || trimmed === '---') {
      if (trimmed === '---') blocks.push(<hr key={key++} className="chat-md-hr" />)
      i++
      continue
    }
    blocks.push(<p key={key++} className="chat-md-p">{renderInline(line, `p-${key}`)}</p>)
    i++
  }
  return (
    <div className="chat-md">
      {blocks}
      <style>{`
        .chat-md { display: flex; flex-direction: column; gap: 0.4rem; overflow-wrap: anywhere; }
        .chat-md-h { font-size: 0.85rem; font-weight: 700; color: #fff; margin: 0.15rem 0 0.1rem; }
        .chat-md-p { margin: 0; }
        .chat-md-ul, .chat-md-ol { margin: 0; padding-left: 1.05rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .chat-md-ul { list-style: disc; }
        .chat-md-ol { list-style: decimal; }
        .chat-md-sub { margin-left: 0.85rem; list-style: circle; opacity: 0.92; }
        .chat-md-strong { color: #fff; font-weight: 700; }
        .chat-md-em { opacity: 0.85; }
        .chat-md-badge { font-family: ui-monospace, monospace; font-size: 0.68rem; background: rgba(99,102,241,0.18); border: 1px solid rgba(99,102,241,0.35); color: #c7d2fe; padding: 0.05rem 0.4rem; border-radius: 9999px; white-space: nowrap; }
        .chat-md-link { color: #93c5fd; text-decoration: underline; text-underline-offset: 2px; }
        .chat-md-link:hover { color: #bfdbfe; }
        .chat-md-quote { margin: 0; padding-left: 0.6rem; border-left: 2px solid rgba(99,102,241,0.6); opacity: 0.9; font-style: italic; }
        .chat-md-hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0.3rem 0; }
        .chat-md-table-wrap { overflow-x: auto; margin: 0.15rem -0.25rem; padding: 0 0.25rem; }
        .chat-md-table { width: 100%; border-collapse: collapse; font-size: 0.72rem; }
        .chat-md-table th { text-align: left; font-weight: 700; color: #fff; background: rgba(99,102,241,0.15); padding: 0.3rem 0.45rem; border: 1px solid rgba(255,255,255,0.1); white-space: nowrap; }
        .chat-md-table td { padding: 0.3rem 0.45rem; border: 1px solid rgba(255,255,255,0.08); vertical-align: top; }
        .chat-md-table tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
      `}</style>
    </div>
  )
}

/* ---------- Orbiting particles ---------- */
function OrbitalParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-accent-400"
          style={{
            animation: `orbit-particle 4s ${i * 1}s linear infinite`,
            opacity: 0.6,
          }}
        />
      ))}
      <style>{`
        @keyframes orbit-particle {
          0%   { transform: translate(-50%, -50%) rotate(0deg) translateX(38px) scale(1); opacity: 0.7; }
          50%  { opacity: 0.25; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(38px) scale(0.4); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

/* ---------- Chat AI avatar with orbiting stars ---------- */
function ChatAIAvatar() {
  return (
    <div className="relative w-6 h-6 flex-shrink-0">
      <img
        src="/ai_portfolio/images/ai/robot.png"
        alt=""
        className="w-6 h-6 rounded-full object-cover border border-white/10"
      />
      {/* orbiting stars */}
      <div className="absolute -inset-2 pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `chat-star-orbit 3s ${i * 0.75}s linear infinite`,
            }}
          >
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l1.5 6.5L20 9l-5 4.5L16.5 20 12 16l-4.5 4L8 13.5 3 9l6.5-0.5z"
                fill={i % 2 === 0 ? '#ffffff' : '#60a5fa'}
                opacity="0.9"
              />
            </svg>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes chat-star-orbit {
          0%   { transform: translate(-50%, -50%) rotate(0deg) translateX(14px) scale(0.5); opacity: 0.3; }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(14px) scale(0.8); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ---------- User avatar (grey) ---------- */
function UserAvatar() {
  return (
    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-500 border border-gray-400/50">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}

/* ---------- AI stars ---------- */
function AIStars() {
  return (
    <div className="absolute inset-0 pointer-events-none z-30" aria-hidden>
      {/* outer orbiting stars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={`outer-${i}`}
          className="absolute top-1/2 left-1/2 text-accent-200 drop-shadow-[0_0_4px_rgba(99,102,241,0.8)]"
          style={{
            animation: `star-orbit-outer 5s ${i * 1}s linear infinite`,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l1.5 6.5L20 9l-5 4.5L16.5 20 12 16l-4.5 4L8 13.5 3 9l6.5-0.5z" fill="currentColor" />
          </svg>
        </div>
      ))}
      {/* inner orbiting stars over the cutout */}
      {[0, 1, 2].map((i) => (
        <div
          key={`inner-${i}`}
          className="absolute top-1/2 left-1/2 text-accent-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
          style={{
            animation: `star-orbit-inner 3s ${i * 1}s linear infinite`,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l1.5 6.5L20 9l-5 4.5L16.5 20 12 16l-4.5 4L8 13.5 3 9l6.5-0.5z" fill="currentColor" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes star-orbit-outer {
          0%   { transform: translate(-50%, -50%) rotate(0deg) translateX(50px) scale(0.2); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(50px) scale(0.5); opacity: 0; }
        }
        @keyframes star-orbit-inner {
          0%   { transform: translate(-50%, -50%) rotate(0deg) translateX(16px) scale(0.4); opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(16px) scale(0.8); opacity: 0; }
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
        style={{ backgroundColor: '#14141f', borderColor: 'rgba(255,255,255,0.12)' }}
        initial={{ opacity: 0, y: 6, scale: 0.9 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
      >
        {label}
      </motion.div>

      <button
        ref={ref}
        onClick={onClick}
        className="relative w-20 h-20 rounded-full flex items-center justify-center outline-none group"
        aria-label={label}
      >
        {/* outer glow */}
        <div className="absolute inset-0 rounded-full bg-accent-500/20 animate-pulse" style={{ animationDuration: '3s' }} />

        {/* gradient orb background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #4f46e5)',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
          }}
        />

        {/* image orb */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-white/30 z-10"
          style={{
            animation: 'float-orb 4s ease-in-out infinite',
            boxShadow: '0 0 30px rgba(99,102,241,0.3)',
          }}
        >
          <img
            src="/ai_portfolio/images/ai/robot.png"
            alt="AI"
            className="w-full h-full object-cover"
          />
        </div>

        {/* rotating outer ring - front */}
        <div
          className="absolute -inset-1 rounded-full pointer-events-none border border-white/20 z-20"
          style={{ animation: 'spin-ring 8s linear infinite' }}
        />
        {/* counter-rotating inner ring - front */}
        <div
          className="absolute inset-[2px] rounded-full pointer-events-none border border-accent-300/30 z-20"
          style={{ animation: 'spin-ring 12s linear infinite reverse' }}
        />

        <AIStars />

        <style>{`
          @keyframes float-orb {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes spin-ring {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <OrbitalParticles />

        {/* hover scale */}
        <div className="absolute inset-0 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60 bg-accent-400/15 blur-xl pointer-events-none" />
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

/* ---------- Character-by-character typing (markdown-aware) ---------- */
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
    }, 8)
    return () => clearInterval(interval)
  }, [text, onDone])

  return (
    <span>
      <ChatMarkdown text={displayed} />
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
                style={{ backgroundColor: '#14141f', borderColor: 'rgba(255,255,255,0.12)' }}
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
              onWheel={e => e.stopPropagation()}
              className="relative overflow-hidden rounded-2xl border border-white/10"
              style={{
                background: 'rgba(16,16,26,0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              {/* revolving light blob */}
              <div
                className="absolute z-0 pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  opacity: 0.35,
                  filter: 'blur(40px)',
                  animation: 'chat-blob-orbit 6s infinite ease',
                }}
              />
              <style>{`
                @keyframes chat-blob-orbit {
                  0%   { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
                  25%  { transform: translate(-100%, -100%) translate3d(380px, 0, 0); }
                  50%  { transform: translate(-100%, -100%) translate3d(380px, 100%, 0); }
                  75%  { transform: translate(-100%, -100%) translate3d(0, 100%, 0); }
                  100% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
                }
              `}</style>

              {/* header */}
              <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20">
                    <img
                      src="/ai_portfolio/images/ai/robot.png"
                      alt="AI"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full animate-pulse bg-accent-400/20" />
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
              <div className="h-[340px] overflow-y-auto p-4 space-y-3 scroll-smooth">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex items-end gap-2',
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <ChatAIAvatar />
                    ) : (
                      <UserAvatar />
                    )}
                    <div
                      className={cn(
                        'text-sm leading-relaxed max-w-[85%] p-3 rounded-2xl',
                        msg.role === 'user'
                          ? 'bg-accent-600 text-white rounded-br-md shadow-lg shadow-accent-600/20'
                          : 'bg-white/5 text-gray-200 rounded-bl-md border border-white/5',
                      )}
                    >
                      {msg.role === 'user' ? msg.content : <ChatMarkdown text={msg.content} />}
                    </div>
                  </motion.div>
                ))}

                {/* typing message */}
                {typingText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <ChatAIAvatar />
                    <div className="text-sm leading-relaxed max-w-[85%] p-3 rounded-2xl bg-white/5 text-gray-200 rounded-bl-md border border-white/5">
                      <TypewriterText text={typingText} onDone={onTypeDone} />
                    </div>
                  </motion.div>
                )}

                {/* thinking dots */}
                {typing && !typingText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <ChatAIAvatar />
                    <div className="text-sm max-w-[85%] p-3 rounded-2xl bg-white/5 text-gray-200 rounded-bl-md border border-white/5">
                      <TypingDots />
                    </div>
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
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-white/5 text-sm text-white/90 placeholder:text-white/25 outline-none rounded-xl px-4 py-2.5 border border-white/10 focus:border-accent-500/50 focus:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className={cn(
                    'p-2 rounded-xl transition-all duration-300',
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
