import { useAppStore, type ViewMode } from '../store/useAppStore'
import { SegmentedControl } from './SegmentedControl'

const OPTIONS = [
  { value: 'body', label: 'Corpo' },
  { value: 'system', label: 'Sistema' },
] as const satisfies readonly { value: ViewMode; label: string }[]

export function ViewModeSwitch() {
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)
  return (
    <SegmentedControl
      ariaLabel="Modo de visualização"
      options={OPTIONS}
      // 'compare' has no button yet; until it does, show it as body view.
      value={viewMode === 'system' ? 'system' : 'body'}
      onChange={setViewMode}
    />
  )
}
