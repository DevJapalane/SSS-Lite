import { create } from 'zustand'
import type { BodyId } from '../data/bodies'
import { REDUCED_MOTION_QUERY } from '../ui/useMediaQuery'

export type ViewMode = 'body' | 'system' | 'compare'
/** How sizes are shown: absolute km or relative to Earth (Terra = 1). */
export type Unit = 'km' | 'earth'
/** The two sides of the comparison (left and right on screen). */
export type CompareSlot = 'a' | 'b'
/** How many times faster than the base orbit speed (1 year = 20 s). */
export type TimeScale = 1 | 10 | 100

interface AppState {
  selectedBodyId: BodyId
  viewMode: ViewMode
  unit: Unit
  compare: Record<CompareSlot, BodyId>
  /** Whether the system view's orbits are frozen (PB13). */
  orbitsPaused: boolean
  timeScale: TimeScale
  /**
   * System and body views at true proportions (sizes and distances) instead
   * of the compressed, everything-visible layout.
   */
  realScale: boolean
  /** Select a body and show it alone: what every body button does. */
  goToBody: (id: BodyId) => void
  setViewMode: (mode: ViewMode) => void
  setUnit: (unit: Unit) => void
  setCompareBody: (slot: CompareSlot, id: BodyId) => void
  toggleOrbits: () => void
  setTimeScale: (scale: TimeScale) => void
  toggleRealScale: () => void
}

/**
 * People who asked their system to reduce motion start with the orbits
 * paused; the button still lets them play. Guarded because tests run in
 * Node, where there is no window.
 */
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches

// Global store: the 3D scene and the UI panels live in separate component
// trees, so sharing state through a store avoids passing props through
// every layer. Components read slices with selectors, e.g.
// `useAppStore((s) => s.selectedBodyId)`, and re-render only when that slice changes.
export const useAppStore = create<AppState>()((set) => ({
  selectedBodyId: 'earth',
  viewMode: 'body',
  unit: 'km',
  // The comparison keeps its own pair, separate from the selected body, so
  // browsing the list doesn't undo a comparison the user set up.
  compare: { a: 'sun', b: 'earth' },
  orbitsPaused: prefersReducedMotion,
  timeScale: 1,
  realScale: false,
  // Picking a body always takes you to it: in system or compare view a
  // selection with no visible effect would feel broken.
  goToBody: (id) => set({ selectedBodyId: id, viewMode: 'body' }),
  // Only the mode changes: selection and unit live in fields of their own,
  // so switching views (Focar included, PB10) comes back to the same body
  // and unit.
  setViewMode: (mode) => set({ viewMode: mode }),
  setUnit: (unit) => set({ unit }),
  setCompareBody: (slot, id) => set((state) => ({ compare: { ...state.compare, [slot]: id } })),
  toggleOrbits: () => set((state) => ({ orbitsPaused: !state.orbitsPaused })),
  setTimeScale: (timeScale) => set({ timeScale }),
  toggleRealScale: () => set((state) => ({ realScale: !state.realScale })),
}))
