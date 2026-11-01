import { describe, expect, it } from 'vitest'
import { useAppStore } from './useAppStore'

describe('useAppStore', () => {
  it('starts on Earth, body view, km', () => {
    const { selectedBodyId, viewMode, unit } = useAppStore.getState()
    expect({ selectedBodyId, viewMode, unit }).toEqual({
      selectedBodyId: 'earth',
      viewMode: 'body',
      unit: 'km',
    })
  })

  it('updates through its actions', () => {
    const { goToBody, setViewMode, setUnit } = useAppStore.getState()
    goToBody('mars')
    setViewMode('system')
    setUnit('earth')
    const state = useAppStore.getState()
    expect(state.selectedBodyId).toBe('mars')
    expect(state.viewMode).toBe('system')
    expect(state.unit).toBe('earth')
  })

  it('changes one side of the comparison without touching the other', () => {
    const { setCompareBody } = useAppStore.getState()
    setCompareBody('b', 'pluto')
    expect(useAppStore.getState().compare).toEqual({ a: 'sun', b: 'pluto' })
  })

  it('goToBody selects and switches to body view in one step', () => {
    const { setViewMode, goToBody } = useAppStore.getState()
    setViewMode('compare')
    goToBody('saturn')
    const state = useAppStore.getState()
    expect(state.selectedBodyId).toBe('saturn')
    expect(state.viewMode).toBe('body')
  })

  it('keeps the selected body and unit through system and compare (Focar, PB10)', () => {
    const { goToBody, setUnit, setViewMode } = useAppStore.getState()
    goToBody('jupiter')
    setUnit('earth')
    setViewMode('system')
    setViewMode('compare')
    setViewMode('body')
    const { selectedBodyId, unit, viewMode } = useAppStore.getState()
    expect({ selectedBodyId, unit, viewMode }).toEqual({
      selectedBodyId: 'jupiter',
      unit: 'earth',
      viewMode: 'body',
    })
  })

  it('pauses and resumes the orbits', () => {
    const before = useAppStore.getState().orbitsPaused
    useAppStore.getState().toggleOrbits()
    expect(useAppStore.getState().orbitsPaused).toBe(!before)
    useAppStore.getState().toggleOrbits()
    expect(useAppStore.getState().orbitsPaused).toBe(before)
  })
})

describe('orbit controls', () => {
  it('changes the speed and toggles real scale', () => {
    const { setTimeScale, toggleRealScale } = useAppStore.getState()
    expect(useAppStore.getState().realScale).toBe(false)
    setTimeScale(100)
    toggleRealScale()
    expect(useAppStore.getState().timeScale).toBe(100)
    expect(useAppStore.getState().realScale).toBe(true)
  })
})
