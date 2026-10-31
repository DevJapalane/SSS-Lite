import { useAppStore, type ViewMode } from '../store/useAppStore'
import { SegmentedControl } from './SegmentedControl'

const OPTIONS = [
  { value: 'body', label: 'Corpo' },
  { value: 'system', label: 'Sistema' },
  { value: 'compare', label: 'Comparar' },
] as const satisfies readonly { value: ViewMode; label: string }[]

export function ViewModeSwitch() {
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)
  return (
    <SegmentedControl
      ariaLabel="Modo de visualização"
      options={OPTIONS}
      value={viewMode}
      onChange={setViewMode}
    />
  )
}
