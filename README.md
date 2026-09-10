# AI Portfolio — Interactive React + TypeScript Portfolio

A modern, interactive developer portfolio built with React, TypeScript, and Vite. The site is organized as a single polished experience with dedicated sections for projects, skills, services, experience, education, certifications, and contact.

## Highlights

- Interactive portfolio navigation and scroll progress
- Project, skills, services, experience, education, and certification sections
- Animated transitions and motion effects
- Three.js-powered 3D experiences
- Lenis-based smooth scrolling
- Floating AI portfolio assistant with predefined responses
- Command palette for quick navigation
- Lazy-loaded page sections for a smoother initial experience
- Responsive UI with Tailwind CSS
- Accessibility detail including a skip-to-content link

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS 4
- **Motion:** Framer Motion, GSAP
- **3D:** Three.js, React Three Fiber, React Three Drei, postprocessing
- **Scrolling:** Lenis
- **Icons:** Lucide React, React Icons
- **Quality:** Oxlint
- **Deployment:** GitHub Pages via `gh-pages`

## Project Structure

```text
ai_portfolio/
├── src/
│   ├── ai/            # Portfolio AI assistant and response engine
│   ├── components/    # Navigation, footer, loaders, utilities, UI
│   ├── hooks/         # Reusable browser and scrolling hooks
│   ├── layouts/       # Main application layout
│   ├── pages/         # Route-level pages
│   ├── sections/      # Hero, About, Skills, Projects, etc.
│   └── utils/         # Shared helpers
├── public/            # Static assets
├── package.json
├── tsconfig.json
└── vite.config.*
```

## Getting Started

### Requirements

- Node.js and npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview the build

```bash
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

The deployment script builds the application and publishes the `dist` directory to the `gh-pages` branch.

## AI Assistant

The portfolio includes a client-side AI-style assistant that answers questions about the portfolio using the local response engine in `src/ai/engine`.

## Current Scope

This repository is a portfolio website rather than a general-purpose application template. The root route renders the complete portfolio experience, with a dedicated `/not-live` route also available.

## License

No license file is currently defined in the repository. Please contact the repository owner for reuse or licensing questions.
