import { useState } from 'react'
import { Download, Award, Briefcase, Code, Users, User } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionLayout from '@/layouts/SectionLayout'
import { SECTION_IDS } from '@/constants'
import profile from '@/data/profile.json'
import AnimatedSection from '@/components/ui/AnimatedSection'

/* Upload your profile image to: public/images/avatar.jpg */

const stats = [
  { icon: Briefcase, label: 'Years Experience', value: profile.experience },
  { icon: Code, label: 'Projects Completed', value: profile.projects },
  { icon: Users, label: 'Happy Clients', value: profile.clients },
  { icon: Award, label: 'Technologies', value: profile.technologies },
]

export default function About() {
  const [imgError, setImgError] = useState(false)
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
          <div className="relative mx-auto w-56 h-56 rounded-2xl overflow-hidden glass group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-transparent z-10" />
            <div className="absolute -inset-1 bg-gradient-to-br from-accent-400 via-accent-600 to-purple-700 rounded-3xl opacity-30 blur-xl group-hover:opacity-60 transition-opacity duration-700 -z-10" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-accent-500/30 z-20 pointer-events-none group-hover:ring-accent-400/60 transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl ring-2 ring-accent-400/0 group-hover:ring-accent-400/30 scale-[1.02] z-20 pointer-events-none transition-all duration-500" />
            {!imgError ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-600/30 to-dark-800 group-hover:scale-110 transition-transform duration-700">
                <User size={56} className="text-accent-400/60 group-hover:text-accent-400/80 transition-colors duration-500" />
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm font-medium text-text-primary">{profile.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</p>
            <p className="text-xs text-dark-400 mt-0.5">{profile.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass rounded-2xl p-6 text-center hover:bg-surface-hover transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
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
