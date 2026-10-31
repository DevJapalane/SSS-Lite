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
    const { selectBody, setViewMode, setUnit } = useAppStore.getState()
    selectBody('mars')
    setViewMode('system')
    setUnit('earth')
    const state = useAppStore.getState()
    expect(state.selectedBodyId).toBe('mars')
    expect(state.viewMode).toBe('system')
    expect(state.unit).toBe('earth')
  })
})
