import { create } from 'zustand'
import type { BodyId } from '../data/bodies'

export type ViewMode = 'body' | 'system' | 'compare'
/** How sizes are shown: absolute km or relative to Earth (Terra = 1). */
export type Unit = 'km' | 'earth'

interface AppState {
  selectedBodyId: BodyId
  viewMode: ViewMode
  unit: Unit
  selectBody: (id: BodyId) => void
  setViewMode: (mode: ViewMode) => void
  setUnit: (unit: Unit) => void
}

// Global store: the 3D scene and the UI panels live in separate component
// trees, so sharing state through a store avoids passing props through
// every layer. Components read slices with selectors, e.g.
// `useAppStore((s) => s.selectedBodyId)`, and re-render only when that slice changes.
export const useAppStore = create<AppState>()((set) => ({
  selectedBodyId: 'earth',
  viewMode: 'body',
  unit: 'km',
  selectBody: (id) => set({ selectedBodyId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setUnit: (unit) => set({ unit }),
}))
