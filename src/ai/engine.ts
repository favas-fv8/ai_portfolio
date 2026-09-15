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

/*
 * Single source of truth: every response below reads directly from
 * `@/data/*.json` + `@/config/site` AT CALL TIME (lazy functions).
 * That means any edit to a section/component JSON (title, description,
 * badges/technologies, dates, links...) is automatically reflected in
 * the chatbot on the next build — no manual sync needed.
 *
 * Responses use lightweight markdown rendered by AIAssistant's
 * ChatMarkdown: ### titles, **highlights**, `badges`, - points,
 *   - sub-points, | tables |, [links](url).
 */

function getDisplayName(): string {
  return profile.name
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

const badge = (t: string) => `\`${t}\``
const badges = (list: string[]) => list.map(badge).join(' ')
const mdLink = (label: string, url: string) => `[${label}](${url})`
const period = (start: string, end: string | null, current: boolean) =>
  current ? `${start} — Present` : `${start} — ${end ?? start}`

// ---------- builders (all lazy, always latest JSON) ----------

function aboutResponse(): string {
  const name = getDisplayName()
  const bio = profile.bio.map(p => `> ${p}`).join('\n\n')
  return `### ${name}\n**${profile.title}**\n*${profile.tagline}*\n\n${bio}\n\n| Metric | Value |\n|---|---|\n| Experience | ${profile.experience}+ years |\n| Projects | ${profile.projects} built & shipped |\n| Certifications | ${profile.certifications} |\n| Technologies | ${profile.technologies} |\n| Location | ${profile.location} |\n| Status | ${profile.available ? '✅ Available for opportunities' : '❌ Not available'} |`
}

function contactResponse(): string {
  const name = getDisplayName()
  return `### Contact ${name}\n\n| Channel | Detail |\n|---|---|\n| 📧 Email | ${mdLink(siteConfig.email, `mailto:${siteConfig.email}`)} |\n| 📍 Location | ${siteConfig.location} |\n| 📞 Phone | ${siteConfig.phone} |\n\n- Use the **contact form** on this site to send a direct message\n- ${mdLink('GitHub', siteConfig.github)} · ${mdLink('LinkedIn', siteConfig.linkedin)}`
}

function skillsResponse(): string {
  const name = getDisplayName()
  const groups = new Map<string, typeof skills>()
  for (const s of skills) {
    const g = groups.get(s.category) ?? []
    g.push(s)
    groups.set(s.category, g)
  }
  const sections = [...groups.entries()]
    .map(([cat, list]) => {
      const top = [...list].sort((a, b) => b.level - a.level).slice(0, 6)
      return `#### ${cat}\n${top.map(s => `- **${s.name}** — ${s.level}% · *${s.experience}*`).join('\n')}`
    })
    .join('\n\n')
  const top3 = [...skills].sort((a, b) => b.level - a.level).slice(0, 3)
  return `### ${name}'s Skills\n\n${sections}\n\n**Top skills:** ${top3.map(s => `${badge(s.name)} ${s.level}%`).join('  ')}\n\n*Total: ${skills.length} skills*`
}

function projectsOverviewResponse(): string {
  const name = getDisplayName()
  const rows = projects
    .map(p => `| **${p.title}** | ${p.year} | ${p.category} | ${p.technologies.slice(0, 3).map(badge).join(' ')} |`)
    .join('\n')
  const details = projects
    .map(
      p =>
        `- **${p.title}** (${p.year})\n  - *${p.tagline}*\n  - ${p.description}\n  - ${badges(p.technologies.slice(0, 5))}`,
    )
    .join('\n')
  return `### ${name}'s Projects (${projects.length})\n\n| Project | Year | Category | Stack |\n|---|---|---|---|\n${rows}\n\n${details}\n\n*Ask me e.g. "Tell me about AI-Job Portal" for full details, links & features.*`
}

function projectDetailResponse(query: string): string | null {
  const q = query.toLowerCase()
  const match = projects.find(
    p =>
      q.includes(p.title.toLowerCase()) ||
      p.title.toLowerCase().split(/[\s-]+/).some(w => w.length > 2 && q.includes(w)),
  )
  if (!match) return null
  const p = match
  const links: string[] = []
  if (p.githubUrl && p.githubUrl !== '#') links.push(mdLink('💻 Code', p.githubUrl))
  if (p.liveUrl && p.liveUrl !== '#' && p.liveUrl !== '/ai_portfolio/not-live')
    links.push(mdLink('🚀 Live Demo', p.liveUrl))
  if (p.videoUrl && p.videoUrl !== '#') links.push(mdLink('🎬 Video', p.videoUrl))
  return `### ${p.title} (${p.year})\n*${p.tagline}*\n\n${p.longDescription}\n\n**Problem:**\n> ${p.problemStatement}\n\n**My role:**\n> ${p.myRole}\n\n**Key features:**\n${p.keyFeatures.slice(0, 8).map(f => `- ${f}`).join('\n')}\n\n**Stack:**\n${badges(p.technologies)}\n\n**Impact:**\n${p.resultsAndImpact.map(r => `- ✅ ${r}`).join('\n')}\n\n${links.length ? links.join('  ·  ') : '*Links available on the project card.*'}`
}

function techProjectsResponse(query: string): string | null {
  const q = query.toLowerCase()
  // Collect every known tech token from skills + projects (latest data)
  const tokens = new Set<string>()
  for (const s of skills) {
    tokens.add(s.name.toLowerCase())
    tokens.add(s.id.toLowerCase())
  }
  for (const p of projects) for (const t of p.technologies) tokens.add(t.toLowerCase())
  const hit = [...tokens].find(t => t.length > 1 && q.includes(t))
  if (!hit) return null
  const matched = projects.filter(p =>
    p.technologies.some(t => t.toLowerCase() === hit || t.toLowerCase().includes(hit)),
  )
  if (matched.length === 0) return null
  return `### Projects using **${hit}** (${matched.length})\n\n${matched
    .map(p => `- **${p.title}** (${p.year}) — *${p.tagline}*\n  - ${badges(p.technologies.filter(t => t.toLowerCase().includes(hit)).slice(0, 4))}`)
    .join('\n')}`
}

function latestProjectsResponse(): string {
  const sorted = [...projects].sort((a, b) => b.year - a.year)
  const top = sorted.slice(0, 3)
  return `### Latest Projects\n\n${top
    .map((p, i) => `${i + 1}. **${p.title}** (${p.year})\n   - *${p.tagline}*\n   - ${p.description}`)
    .join('\n')}`
}

function experienceResponse(): string {
  const name = getDisplayName()
  const list = experience
    .map(
      e =>
        `- **${e.role}** at *${e.company}* — ${period(e.startDate, e.endDate, e.current)}\n  - ${e.description}\n  - ${badges(e.technologies)}`,
    )
    .join('\n')
  return `### ${name}'s Experience (${profile.experience}+ years)\n\n${list}`
}

function educationResponse(): string {
  const list = education
    .map(
      e =>
        `- **${e.degree}${e.field ? ` in ${e.field}` : ''}** — *${e.institution}* (${e.startDate} — ${e.endDate})\n  - 📍 ${e.location}\n  - 🎓 ${e.grade}${e.achievements.length ? `\n  - ${e.achievements.map(a => `▸ ${a}`).join('\n  - ')}` : ''}`,
    )
    .join('\n')
  return `### Education\n\n${list}`
}

function certificationsResponse(): string {
  const rows = certifications
    .map(c => `| **${c.title}** | ${c.issuer} | ${c.date} |`)
    .join('\n')
  return `### Certifications (${certifications.length})\n\n| Title | Issuer | Date |\n|---|---|---|\n${rows}\n\n*Ask about a specific certificate for details.*`
}

function servicesResponse(): string {
  return `### Services Offered\n\n${services
    .map(s => `- **${s.title}** — ${s.description}\n${s.features.map(f => `  - ${f}`).join('\n')}`)
    .join('\n')}`
}

function helpResponse(): string {
  const name = getDisplayName()
  return `### How I can help\n\n- **Who are you?** — about ${name}\n- **What technologies do you know?** — skills table\n- **Show me your projects** — overview table\n- **Tell me about _<project>_ ** — full detail + features + stack + links\n- **React / Django / Python projects?** — tech-filtered list\n- **Latest work?** — newest by year\n- **Experience / Education / Certifications / Services** — formatted timelines\n- **Contact / Resume / GitHub / LinkedIn** — links`
}

// ---------- pattern table ----------

interface WeightedMatch {
  keywords: string[]
  weight: number
  response: () => string
  hint?: string
}

const patterns: WeightedMatch[] = [
  { keywords: ['contact', 'email', 'reach', 'phone', 'message', 'location'], weight: 10, response: contactResponse },
  { keywords: ['who', 'about', 'yourself', 'introduce', 'bio'], weight: 10, response: aboutResponse },
  { keywords: ['skill', 'technolog', 'stack', 'proficient', 'know', 'expert'], weight: 9, response: skillsResponse },
  {
    keywords: ['project', 'portfolio', 'built', 'work'],
    weight: 9,
    response: () => {
      // If a specific project title is mentioned, prefer its detail view
      return projectsOverviewResponse()
    },
  },
  { keywords: ['latest', 'recent', 'newest'], weight: 9, response: latestProjectsResponse },
  { keywords: ['experience', 'career', 'company', 'internship', 'job'], weight: 9, response: experienceResponse },
  { keywords: ['education', 'study', 'studied', 'university', 'college', 'degree', 'school'], weight: 9, response: educationResponse },
  { keywords: ['certification', 'certificate', 'credential'], weight: 8, response: certificationsResponse },
  { keywords: ['service', 'offer', 'provide'], weight: 7, response: servicesResponse },
  {
    keywords: ['resume', 'cv', 'download'],
    weight: 10,
    response: () => {
      window.open(profile.resumeUrl, '_blank')
      return `### Resume\n\n${mdLink('📄 Open / Download Resume', profile.resumeUrl)}\n\n*Opened in a new tab.*`
    },
  },
  {
    keywords: ['github'],
    weight: 8,
    response: () => {
      window.open(siteConfig.github, '_blank')
      return `### GitHub\n\n${mdLink('💻 Open GitHub profile', siteConfig.github)}`
    },
  },
  {
    keywords: ['linkedin'],
    weight: 8,
    response: () => {
      window.open(siteConfig.linkedin, '_blank')
      return `### LinkedIn\n\n${mdLink('🔗 Open LinkedIn profile', siteConfig.linkedin)}`
    },
  },
  {
    keywords: ['available', 'freelance', 'hire', 'hiring', 'opportunity'],
    weight: 7,
    response: () => {
      const name = getDisplayName()
      return `### Availability\n\n**${name}** is currently ${profile.available ? '✅ **available** for freelance & collaboration' : '❌ **not available**'}.\n\n${contactResponse()}`
    },
  },
  { keywords: ['hello', 'hi', 'hey', 'greetings'], weight: 5, response: () => `Hello! I'm **${getDisplayName()}'s** portfolio assistant. 🤖\n\n${helpResponse()}` },
  { keywords: ['help', 'what can you do', 'options'], weight: 6, response: helpResponse },
]

export function findBestResponse(input: string): string {
  const lower = input.toLowerCase().replace(/[?.,!]/g, ' ').replace(/\s+/g, ' ').trim()

  // 1. Exact project title mentioned? → richest detail (always latest JSON)
  const detail = projectDetailResponse(lower)
  if (detail && /(tell|about|detail|info|feature|show|project)/.test(lower)) return detail

  // 2. Tech-filtered project list? (uses latest skills + project badges)
  if (/(project|built|using|with|using)/.test(lower)) {
    const tech = techProjectsResponse(lower)
    if (tech) return tech
  } else {
    // also allow bare "react projects", "django work", etc.
    const tech = techProjectsResponse(lower)
    if (tech && /(react|django|python|typescript|tensorflow|project)/.test(lower)) return tech
  }

  // 3. If only a project name was typed, still show its detail
  if (detail) return detail

  if (lower.includes('contact you') || lower.includes('how can i contact')) return contactResponse()

  const words = new Set(lower.split(' '))

  let bestScore = 0
  let bestResponse: string | null = null

  for (const pattern of patterns) {
    let score = 0
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) {
        // whole-word hits score higher than substring hits
        score += words.has(kw) ? pattern.weight : pattern.weight * 0.5
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestResponse = pattern.response()
    }
  }

  if (bestScore === 0 || !bestResponse) {
    const faq = faqData.find(
      f =>
        lower.includes(f.question.toLowerCase().slice(0, 25)) ||
        f.question.toLowerCase().split(' ').slice(0, 3).every(w => lower.includes(w)),
    )
    if (faq) return `### ${faq.question}\n\n${faq.answer}`
    return `I'm not sure how to answer that. 🤔\n\n${helpResponse()}`
  }

  return bestResponse
}

export const suggestedQuestions = [
  'Who are you?',
  'What technologies do you know?',
  'Show me your projects',
  'Tell me about AI-Job Portal',
  'What is your experience?',
  'How can I contact you?',
]
