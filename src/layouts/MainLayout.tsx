import { lazy, Suspense } from 'react'
import Loader from '@/components/Loader'
import CustomCursor from '@/components/cursor/CustomCursor'
import Navigation from '@/components/Navigation'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import AIAssistant from '@/ai/AIAssistant'
import CommandPalette from '@/components/CommandPalette'
import { useLenis } from '@/hooks/useLenis'

const Hero = lazy(() => import('@/sections/Hero'))
const About = lazy(() => import('@/sections/About'))
const Skills = lazy(() => import('@/sections/Skills'))
const Projects = lazy(() => import('@/sections/Projects'))
const Services = lazy(() => import('@/sections/Services'))
const Experience = lazy(() => import('@/sections/Experience'))
const Education = lazy(() => import('@/sections/Education'))
const Certifications = lazy(() => import('@/sections/Certifications'))
const Contact = lazy(() => import('@/sections/Contact'))

const sectionLoader = <div className="h-64 flex items-center justify-center text-dark-400">Loading...</div>

export default function MainLayout() {
  useLenis()

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="noise-overlay" />
      <Loader />
      <CustomCursor />
      <Navigation />
      <ScrollProgress />

      <main id="main-content">
        <Suspense fallback={sectionLoader}><Hero /></Suspense>
        <Suspense fallback={sectionLoader}><About /></Suspense>
        <Suspense fallback={sectionLoader}><Skills /></Suspense>
        <Suspense fallback={sectionLoader}><Projects /></Suspense>
        <Suspense fallback={sectionLoader}><Services /></Suspense>
        <Suspense fallback={sectionLoader}><Experience /></Suspense>
        <Suspense fallback={sectionLoader}><Education /></Suspense>
        <Suspense fallback={sectionLoader}><Certifications /></Suspense>
        <Suspense fallback={sectionLoader}><Contact /></Suspense>
      </main>

      <Footer />
      <AIAssistant />
      <CommandPalette />
    </>
  )
}
