import { useState } from 'react'
import { Download, Award, Briefcase, Code, Users, User } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import profile from '@/data/profile.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

const stats = [
  { icon: Briefcase, label: 'Years Experience', value: profile.experience },
  { icon: Code, label: 'Projects Completed', value: profile.projects },
  { icon: Users, label: 'Happy Clients', value: profile.clients },
  { icon: Award, label: 'Technologies', value: profile.technologies },
]

export default function About() {
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <SectionLayout id={SECTION_IDS.about} className="bg-dark-900">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <AnimatedSection>
          <p className="text-sm font-mono text-accent-400 tracking-widest uppercase mb-4">
            About Me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Turning Ideas Into
            <span className="text-gradient"> Digital Reality</span>
          </h2>
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="text-dark-300 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 mt-4 glass glass-hover rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Download size={16} />
            Download Resume
          </a>
        </AnimatedSection>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-56 h-56 rounded-full group flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ perspective: '600px' }}
          >
            {/* Tilt group — glass bg + SVG ring + border tilt together backward */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                transformOrigin: 'bottom',
                transform: isHovered
                  ? 'perspective(600px) rotateX(58deg) scaleY(0.82)'
                  : 'perspective(600px) rotateX(0deg) scaleY(1)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: -1,
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 224 224">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.5)" />
                    <stop offset="100%" stopColor="rgba(139,92,246,0.25)" />
                  </linearGradient>
                </defs>
                <circle cx="112" cy="112" r="100" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                <circle
                  cx="112" cy="112" r="100"
                  fill="none" stroke="url(#ringGrad)" strokeWidth="5"
                  strokeDasharray="628.3"
                  strokeDashoffset={isHovered ? '0' : '628.3'}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                    filter: isHovered ? 'drop-shadow(0 0 8px rgba(99,102,241,0.3))' : 'none',
                  }}
                />
              </svg>
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: isHovered ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'border 0.5s ease',
                }}
              />
            </div>

            {/* Ambient glow behind tilt group */}
            <div
              className="absolute -inset-2 rounded-full blur-2xl pointer-events-none"
              style={{
                background: isHovered
                  ? 'linear-gradient(145deg, rgba(99,102,241,0.35), rgba(139,92,246,0.25))'
                  : 'linear-gradient(145deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                zIndex: -2,
                transition: 'background 0.5s ease',
              }}
            />

            {/* Cutout outline glow — only during scale-up */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ zIndex: 0 }}
              animate={isHovered ? {
                boxShadow: [
                  '0 0 0px 0px rgba(99,102,241,0)',
                  '0 0 40px 15px rgba(99,102,241,0.25), 0 0 80px 30px rgba(139,92,246,0.12)',
                  '0 0 20px 8px rgba(99,102,241,0.18), 0 0 40px 18px rgba(139,92,246,0.08)',
                  '0 0 50px 20px rgba(99,102,241,0.12), 0 0 100px 40px rgba(139,92,246,0.05)',
                  '0 0 25px 10px rgba(99,102,241,0.08)',
                ],
                opacity: [0, 1, 0.6, 0.4, 0.25],
              } : {
                boxShadow: '0 0 0px 0px rgba(99,102,241,0)',
                opacity: 0,
              }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />

            {/* Waving glow ring — sweeps along cutout outline during hover */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                zIndex: 0,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.6s ease',
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(99,102,241,0.35) 12%, rgba(139,92,246,0.25) 18%, transparent 28%, transparent 100%)',
                animation: isHovered ? 'wave-glow 2s linear infinite' : 'none',
                WebkitMask:
                  'radial-gradient(circle at 50% 50%, transparent 44%, black 44%, black 48%, transparent 48%)',
                mask:
                  'radial-gradient(circle at 50% 50%, transparent 44%, black 44%, black 48%, transparent 48%)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Cutout blue glow */}
            <div
              className="absolute inset-4 rounded-full blur-3xl pointer-events-none"
              style={{
                background: isHovered
                  ? 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)'
                  : 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)',
                transition: 'background 0.5s ease',
                zIndex: 0,
              }}
            />

            {!imgError ? (
              <motion.img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-contain will-change-transform z-[1] origin-bottom"
                animate={{
                  scale: isHovered ? 1.9 : 1,
                  translateZ: isHovered ? '140px' : '0px',
                  filter: isHovered
                    ? 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'
                    : 'drop-shadow(0 10px 25px rgba(0,0,0,0.35))',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 18,
                  mass: 0.9,
                }}
                onError={() => setImgError(true)}
              />
            ) : (
              <motion.div
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-600/30 to-dark-800 rounded-full origin-bottom"
                animate={{
                  scale: isHovered ? 1.9 : 1,
                  translateZ: isHovered ? '140px' : '0px',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 18,
                  mass: 0.9,
                }}
                style={{ zIndex: isHovered ? 25 : 5, position: 'relative' }}
              >
                <User size={56} className="text-accent-400/60 transition-colors duration-500" />
              </motion.div>
            )}

            {/* Caption glow ring — outer */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                bottom: '-38px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 25,
                width: '160%',
                height: '12px',
                borderRadius: '50%',
                background:
                  'radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.15) 40%, transparent 70%)',
              }}
              animate={isHovered ? {
                opacity: [0, 1, 0.6, 0.8, 0.5],
                scale: [0.6, 1.6, 1.2, 1.4, 1.2],
              } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
            />

            {/* Caption glow ring — inner */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                bottom: '-26px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 28,
                width: '80%',
                height: '4px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(99,102,241,0.2), transparent)',
              }}
              animate={isHovered ? {
                opacity: [0, 0.6, 0.3],
                scale: [0.8, 1.3, 1],
              } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Caption */}
            <motion.div
              className="absolute left-1/2 pointer-events-none"
              style={{
                bottom: '-32px',
                zIndex: 30,
                transform: isHovered
                  ? 'perspective(500px) translateX(-50%) rotateX(0deg)'
                  : 'perspective(500px) translateX(-50%) rotateX(90deg)',
                transformOrigin: 'top',
                backfaceVisibility: 'hidden',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <motion.span
                className="inline-flex items-center gap-0.5 text-sm font-bold bg-black/70 backdrop-blur-md px-5 py-3 rounded-full whitespace-nowrap border overflow-hidden relative"
                animate={isHovered ? {
                  boxShadow: [
                    '0 0 0px rgba(99,102,241,0), 0 0 0px rgba(139,92,246,0)',
                    '0 0 25px rgba(99,102,241,0.35), 0 0 50px rgba(139,92,246,0.2)',
                    '0 0 8px rgba(99,102,241,0.15), 0 0 15px rgba(139,92,246,0.08)',
                  ],
                  borderColor: [
                    'rgba(255,255,255,0.1)',
                    'rgba(99,102,241,0.5)',
                    'rgba(139,92,246,0.3)',
                    'rgba(99,102,241,0.4)',
                  ],
                } : {
                  boxShadow: '0 0 0px rgba(99,102,241,0)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
              >
                {/* Shimmer sweep overlay */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ borderRadius: 'inherit' }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'translateX(-100%)',
                        borderRadius: 'inherit',
                      }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                    />
                  </motion.div>
                )}
                {/* Letter stagger */}
                {(() => {
                  const words = profile.name.split(' ').map(w =>
                    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                  )
                  return words.map((word, wi) => (
                    <span key={wi} className="inline-flex">
                      {word.split('').map((char, ci) => (
                        <motion.span
                          key={ci}
                          className="inline-block"
                          style={{
                            backgroundImage:
                              'linear-gradient(135deg, #fff 25%, #a78bfa 55%, #818cf8 80%, #fff 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            backgroundSize: '200% 100%',
                          }}
                          animate={isHovered ? {
                            y: [20, -3, 0],
                            opacity: [0, 1],
                            rotate: [-8, 2, 0],
                            backgroundPosition: ['0% 0%', '100% 0%'],
                          } : {
                            y: 0,
                            opacity: 1,
                            rotate: 0,
                            backgroundPosition: '0% 0%',
                            color: 'rgba(255,255,255,0.9)',
                          }}
                          transition={{
                            delay: 0.25 + (wi * word.length + ci) * 0.035,
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                      {wi < words.length - 1 && (
                        <span className="inline-block mx-1">&nbsp;</span>
                      )}
                    </span>
                  ))
                })()}
              </motion.span>
            </motion.div>
          </motion.div>
          <div className="text-center mt-4">
            <p className="text-xs text-dark-400">{profile.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="group relative glass rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>
                <stat.icon className="mx-auto mb-3 text-accent-400" size={28} />
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stat.value}+
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  )
}
