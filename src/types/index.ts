export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string[]
  avatar: string
  resumeUrl: string
  email: string
  phone: string
  location: string
  available: boolean
  experience: number
  projects: number
  clients: number
  technologies: number
}

export interface Social {
  name: string
  url: string
  icon: string
}

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'design' | 'tools' | 'soft-skills'
  level: number
  icon: string
  color: string
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  technologies: string[]
  category: string
  featured: boolean
  githubUrl?: string
  liveUrl?: string
  year: number
}

export interface Experience {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  grade?: string
  achievements: string[]
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface Certification {
  id: string
  title: string
  issuer: string
  date: string
  credentialUrl?: string
  image: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  content: string
  rating: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface NavItem {
  label: string
  href: string
  sectionId: string
}
