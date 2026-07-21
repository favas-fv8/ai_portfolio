import profile from '@/data/profile.json'
import skills from '@/data/skills.json'
import projects from '@/data/projects.json'
import experience from '@/data/experience.json'
import education from '@/data/education.json'
import services from '@/data/services.json'
import certifications from '@/data/certifications.json'
import faqData from '@/data/faq.json'
import { siteConfig } from '@/config/site'

export interface Message {
  role: 'assistant' | 'user'
  content: string
}

/* Resume & avatar should be placed in: public/resume.pdf, public/images/avatar.jpg */

const displayName = profile.name.split(' ').map(
  w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
).join(' ')

interface WeightedMatch {
  keywords: string[]
  weight: number
  response: string | (() => string)
}

const patterns: WeightedMatch[] = [
  {
    keywords: ['contact', 'email', 'reach', 'phone', 'message'],
    weight: 10,
    response: `You can reach ${displayName} via:\n- Email: ${siteConfig.email}\n- Location: ${siteConfig.location}\n\nOr use the contact form on this site to send a direct message.`,
  },
  {
    keywords: ['who', 'are', 'you', 'yourself', 'about'],
    weight: 10,
    response: () => `I'm ${displayName}, a ${profile.title}. ${profile.bio[0]}`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    weight: 8,
    response: `Hello! I'm ${displayName}'s portfolio assistant. How can I help you today?`,
  },
  {
    keywords: ['skill', 'technologies', 'tech', 'stack', 'know', 'proficient'],
    weight: 9,
    response: () => {
      const names = skills.map(s => s.name).join(', ')
      return `${displayName} is proficient in: ${names}. Top skills include React (${skills.find(s => s.id === 'react')?.level}%), TypeScript (${skills.find(s => s.id === 'typescript')?.level}%), and JavaScript (${skills.find(s => s.id === 'javascript')?.level}%).`
    },
  },
  {
    keywords: ['project', 'portfolio', 'work', 'built'],
    weight: 9,
    response: () => {
      const list = projects.map(p => `- ${p.title}: ${p.description}`).join('\n')
      return `Here are ${displayName}'s projects:\n${list}`
    },
  },
  {
    keywords: ['react'],
    weight: 7,
    response: () => {
      const reactProjects = projects.filter(p =>
        p.technologies.some(t => t.toLowerCase() === 'react'),
      )
      if (reactProjects.length === 0) return 'No React projects found.'
      return `React projects:\n${reactProjects.map(p => `- ${p.title}`).join('\n')}`
    },
  },
  {
    keywords: ['django', 'python'],
    weight: 7,
    response: () => {
      const pyProjects = projects.filter(p =>
        p.technologies.some(t => t.toLowerCase().includes('python')),
      )
      if (pyProjects.length === 0) return 'No Django/Python projects found in the portfolio.'
      return `Python/Django projects:\n${pyProjects.map(p => `- ${p.title}`).join('\n')}`
    },
  },
  {
    keywords: ['latest', 'recent', 'newest'],
    weight: 8,
    response: () => {
      const sorted = [...projects].sort((a, b) => b.year - a.year)
      const latest = sorted[0]
      return `The latest project is "${latest.title}" (${latest.year}). ${latest.description}`
    },
  },
  {
    keywords: ['experience', 'work', 'job', 'career', 'company'],
    weight: 9,
    response: () => {
      const list = experience.map(e =>
        `- ${e.role} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})`,
      ).join('\n')
      return `${displayName} has ${profile.experience}+ years of experience:\n${list}`
    },
  },
  {
    keywords: ['education', 'study', 'studied', 'university', 'college', 'degree'],
    weight: 9,
    response: () => {
      const list = education.map(e =>
        `- ${e.degree} in ${e.field} from ${e.institution} (${e.startDate} - ${e.endDate})`,
      ).join('\n')
      return `Education:\n${list}`
    },
  },
  {
    keywords: ['certification', 'certificate', 'credential'],
    weight: 8,
    response: () => {
      const list = certifications.map(c =>
        `- ${c.title} by ${c.issuer} (${c.date})`,
      ).join('\n')
      return `Certifications:\n${list}`
    },
  },
  {
    keywords: ['service', 'offer', 'provide', 'do'],
    weight: 7,
    response: () => {
      const list = services.map(s => `- ${s.title}: ${s.description}`).join('\n')
      return `Services offered:\n${list}`
    },
  },
  {
    keywords: ['resume', 'cv', 'download'],
    weight: 10,
    response: () => {
      window.open(profile.resumeUrl, '_blank')
      return 'Opening the resume in a new tab.'
    },
  },
  {
    keywords: ['github'],
    weight: 8,
    response: () => {
      window.open(siteConfig.github, '_blank')
      return 'Opening GitHub profile.'
    },
  },
  {
    keywords: ['linkedin'],
    weight: 8,
    response: () => {
      window.open(siteConfig.linkedin, '_blank')
      return 'Opening LinkedIn profile.'
    },
  },
  {
    keywords: ['available', 'freelance', 'hire', 'hiring'],
    weight: 7,
    response: `${displayName} is currently ${profile.available ? 'available' : 'not available'} for opportunities.`,
  },
]

export function findBestResponse(input: string): string {
  const lower = input.toLowerCase()
  const words = lower.split(/\s+/)

  let bestScore = 0
  let bestResponse: string | null = null

  for (const pattern of patterns) {
    let score = 0
    for (const kw of pattern.keywords) {
      if (words.some(w => w.includes(kw) || kw.includes(w))) {
        score += pattern.weight
      }
    }
    if (score > bestScore) {
      bestScore = score
      const resp = pattern.response
      bestResponse = typeof resp === 'function' ? resp() : resp
    }
  }

  if (bestScore === 0) {
    const faq = faqData.find(f =>
      lower.includes(f.question.toLowerCase().slice(0, 20)),
    )
    if (faq) return faq.answer

    return `I'm not sure how to answer that. Try asking about ${displayName}'s skills, projects, experience, or contact information.`
  }

  return bestResponse!
}

export const suggestedQuestions = [
  'Who are you?',
  'What technologies do you know?',
  'Show me your projects',
  'What is your experience?',
  'How can I contact you?',
  'Download resume',
  'Open GitHub',
  'Open LinkedIn',
]
