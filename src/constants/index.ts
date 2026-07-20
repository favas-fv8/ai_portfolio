export const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slower: 0.8,
    slowest: 1.2,
  },
  easing: {
    easeOut: [0.16, 1, 0.3, 1],
    easeInOut: [0.76, 0, 0.24, 1],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
  },
  stagger: {
    fast: 0.04,
    normal: 0.08,
    slow: 0.12,
  },
} as const

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  navigation: 300,
  overlay: 400,
  modal: 500,
  cursor: 600,
  loader: 700,
  toaster: 800,
  assistant: 900,
  commandPalette: 1000,
} as const

export const BREAKPOINTS = {
  mobileSm: 320,
  mobile: 375,
  mobileLg: 414,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  fullHd: 1920,
  twoK: 2560,
  fourK: 3840,
} as const

export const SECTION_IDS = {
  hero: 'hero',
  about: 'about',
  skills: 'skills',
  projects: 'projects',
  services: 'services',
  experience: 'experience',
  education: 'education',
  certifications: 'certifications',
  testimonials: 'testimonials',
  contact: 'contact',
} as const
