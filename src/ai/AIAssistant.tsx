'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { findBestResponse, suggestedQuestions, type Message } from './engine'

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m the portfolio assistant. Ask me anything about Mohammed Favas!',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') return
      if (e.key === 'Escape' && open) setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const handleSend = async (text: string) => {
    if (!text.trim() || typing) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    await new Promise(r => setTimeout(r, 600 + Math.random() * 600))

    const response = findBestResponse(text)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setTyping(false)
  }

  const handleSuggested = (q: string) => {
    handleSend(q)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-6 right-6 z-[900] p-4 rounded-full',
          'bg-accent-600 hover:bg-accent-500 text-white',
          'shadow-lg transition-all duration-300 hover:scale-110',
          open && 'scale-90',
        )}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {unread > 0 && !open && (
        <div className="fixed bottom-20 right-8 z-[900] w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}

      <div
        className={cn(
          'fixed bottom-24 right-6 z-[900] w-[360px] max-w-[calc(100vw-2rem)]',
          'bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30',
          'overflow-hidden transition-all duration-500',
          open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none',
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent-500" />
            <span className="text-sm font-medium text-gray-800">Portfolio Assistant</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="h-[380px] overflow-y-auto p-4 space-y-3 bg-white/40">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'text-sm leading-relaxed max-w-[85%] p-3 rounded-2xl shadow-sm',
                msg.role === 'user'
                  ? 'bg-accent-500 text-white ml-auto rounded-br-md'
                  : 'bg-white text-gray-700 rounded-bl-md',
              )}
            >
              {msg.content}
            </div>
          ))}

          {typing && (
            <div className="bg-white text-gray-700 text-sm max-w-[85%] p-3 rounded-2xl rounded-bl-md shadow-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-2 bg-white/40">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.slice(0, 4).map(q => (
                <button
                  key={q}
                  onClick={() => handleSuggested(q)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors border border-gray-200/50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={e => { e.preventDefault(); handleSend(input) }}
          className="flex items-center gap-2 px-4 py-3 border-t border-gray-200/50 bg-white/60"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="p-2 text-accent-500 hover:text-accent-600 disabled:text-gray-300 transition-colors"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  )
}
