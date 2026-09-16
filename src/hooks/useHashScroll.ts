import { useEffect } from 'react'
import { scrollToSectionId } from '@/utils/scrollToSection'

const RETRY_INTERVAL_MS = 100
const RETRY_TIMEOUT_MS = 6000

function hashToId(hash: string): string {
  try {
    return decodeURIComponent(hash.replace(/^#/, '').trim())
  } catch {
    return hash.replace(/^#/, '').trim()
  }
}

/**
 * Deep-link support for every `<section id="...">`.
 * - No-op when there is no `#hash` (landing page behaviour unchanged).
 * - Retries until lazy-loaded (`React.lazy` + `Suspense`) sections mount.
 * - Re-affirms after `window load` so fonts/images shifting layout don't
 *   leave the target misaligned.
 * - Handles in-page `hashchange` (manual URL edits, back/forward).
 */
export function useHashScroll() {
  useEffect(() => {
    let disposed = false
    let intervalId: ReturnType<typeof setInterval> | null = null
    let loadHandler: (() => void) | null = null

    const attempt = (id: string, behavior: ScrollBehavior): boolean => {
      if (!id) return true
      if (!document.getElementById(id)) return false
      // Don't rewrite URL here — it already contains the hash.
      scrollToSectionId(id, { behavior, updateUrl: false })
      return true
    }

    const attemptWithRetry = (hash: string, behavior: ScrollBehavior) => {
      const id = hashToId(hash)
      if (!id) return
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      if (attempt(id, behavior)) {
        // Element was already mounted (e.g. hash changed after load).
        // Still re-affirm once after full load in case layout shifts.
        scheduleLoadReaffirm(id, behavior)
        return
      }
      const started = Date.now()
      intervalId = setInterval(() => {
        if (disposed) {
          if (intervalId) clearInterval(intervalId)
          return
        }
        if (attempt(id, behavior) || Date.now() - started > RETRY_TIMEOUT_MS) {
          if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
          }
        }
      }, RETRY_INTERVAL_MS)
      scheduleLoadReaffirm(id, behavior)
    }

    const scheduleLoadReaffirm = (id: string, behavior: ScrollBehavior) => {
      if (document.readyState === 'complete') {
        // One delayed re-affirm covers late image/font layout shifts.
        window.setTimeout(() => {
          if (!disposed && hashToId(window.location.hash) === id) attempt(id, behavior)
        }, 500)
        return
      }
      if (loadHandler) window.removeEventListener('load', loadHandler)
      loadHandler = () => {
        window.setTimeout(() => {
          if (!disposed && hashToId(window.location.hash) === id) attempt(id, behavior)
        }, 300)
      }
      window.addEventListener('load', loadHandler)
    }

    // Initial deep link — jump instantly so a shared
    // `...#certifications` URL doesn't smooth-scroll from the top.
    if (window.location.hash) {
      attemptWithRetry(window.location.hash, 'auto')
    }

    const onHashChange = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      attemptWithRetry(window.location.hash, reduced ? 'auto' : 'smooth')
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      disposed = true
      if (intervalId) clearInterval(intervalId)
      if (loadHandler) window.removeEventListener('load', loadHandler)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])
}
