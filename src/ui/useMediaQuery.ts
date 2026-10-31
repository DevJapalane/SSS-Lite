import { useSyncExternalStore } from 'react'

/**
 * True while a CSS media query matches. useSyncExternalStore subscribes to
 * the browser's own change event, so the component re-renders exactly when
 * the query flips (e.g. rotating a tablet) and never in between.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}

/** Same breakpoint as the CSS (`max-width: 768px`). */
export const MOBILE_QUERY = '(max-width: 768px)'
