/**
 * Shared section-scroll helper.
 * Additive only: same visual result as the previous
 * `el.scrollIntoView({ behavior: 'smooth' })`, but
 * - works through Lenis when available (with fixed-header offset)
 * - optionally mirrors the section into the URL hash so links are shareable
 * - preserves `?utm_*` query params via `location.search`
 */
export const SECTION_SCROLL_OFFSET = -80

type LenisLike = {
  scrollTo: (target: HTMLElement | string | number, opts?: Record<string, unknown>) => void
}

function getLenis(): LenisLike | null {
  const w = window as unknown as { __lenis?: LenisLike }
  return w.__lenis ?? null
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToSectionId(
  sectionId: string,
  opts: { behavior?: ScrollBehavior; updateUrl?: boolean } = {},
): boolean {
  const el = document.getElementById(sectionId)
  if (!el) return false

  const { behavior, updateUrl = true } = opts

  if (updateUrl) {
    // replaceState (not location.hash =) so we don't fire `hashchange`
    // and double-scroll with the useHashScroll listener.
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${sectionId}`)
  }

  const resolvedBehavior: ScrollBehavior = behavior ?? (prefersReducedMotion() ? 'auto' : 'smooth')

  const lenis = getLenis()
  if (lenis) {
    try {
      lenis.scrollTo(el, {
        offset: SECTION_SCROLL_OFFSET,
        duration: resolvedBehavior === 'auto' ? 0 : 1.2,
      })
      return true
    } catch {
      // fall through to native fallback below
    }
  }

  if (resolvedBehavior === 'auto') {
    const y = el.getBoundingClientRect().top + window.scrollY + SECTION_SCROLL_OFFSET
    window.scrollTo({ top: Math.max(y, 0), behavior: 'auto' })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Compensate for the fixed header without breaking the smooth animation.
    // `scrollIntoView` has no offset option, so nudge after the browser starts it.
    window.setTimeout(() => window.scrollBy({ top: SECTION_SCROLL_OFFSET, behavior: 'smooth' }), 50)
  }
  return true
}

export function clearSectionHash() {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}
