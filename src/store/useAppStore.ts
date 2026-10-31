import { create } from 'zustand'
import type { BodyId } from '../data/bodies'

export type ViewMode = 'body' | 'system' | 'compare'
/** How sizes are shown: absolute km or relative to Earth (Terra = 1). */
export type Unit = 'km' | 'earth'
/** The two sides of the comparison (left and right on screen). */
export type CompareSlot = 'a' | 'b'

interface AppState {
  selectedBodyId: BodyId
  viewMode: ViewMode
  unit: Unit
  compare: Record<CompareSlot, BodyId>
  selectBody: (id: BodyId) => void
  /** Select a body and show it alone: what every body button does. */
  goToBody: (id: BodyId) => void
  setViewMode: (mode: ViewMode) => void
  setUnit: (unit: Unit) => void
  setCompareBody: (slot: CompareSlot, id: BodyId) => void
}

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
  selectBody: (id) => set({ selectedBodyId: id }),
  // Picking a body always takes you to it: in system or compare view a
  // selection with no visible effect would feel broken.
  goToBody: (id) => set({ selectedBodyId: id, viewMode: 'body' }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setUnit: (unit) => set({ unit }),
  setCompareBody: (slot, id) => set((state) => ({ compare: { ...state.compare, [slot]: id } })),
}))
