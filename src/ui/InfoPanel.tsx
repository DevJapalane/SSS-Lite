import { getBodyById } from '../data/bodies'
import { useAppStore, type Unit } from '../store/useAppStore'
import { getBodyStats } from '../utils/bodyStats'
import { BodyBadge } from './BodyBadge'
import styles from './InfoPanel.module.css'
import { PanelCard } from './PanelCard'
import { SegmentedControl } from './SegmentedControl'

const UNIT_OPTIONS = [
  { value: 'km', label: 'km' },
  { value: 'earth', label: '× Terra' },
] as const satisfies readonly { value: Unit; label: string }[]

/** Data of the selected body. */
export function InfoPanel() {
  const body = getBodyById(useAppStore((s) => s.selectedBodyId))
  const unit = useAppStore((s) => s.unit)
  const setUnit = useAppStore((s) => s.setUnit)
  const stats = getBodyStats(body, unit, getBodyById('earth'))

  return (
    <PanelCard title={body.name} titleExtra={<BodyBadge type={body.type} />}>
      <SegmentedControl ariaLabel="Unidade" options={UNIT_OPTIONS} value={unit} onChange={setUnit} />
      <dl className={styles.stats}>
        {stats.map((row) => (
          <div key={row.id} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {body.orbitalVelocityKmS === null && (
        <p className={styles.note}>
          O Sol não tem velocidade orbital aqui: ele é a referência em torno da qual os
          planetas orbitam.
        </p>
      )}
    </PanelCard>
  )
}
