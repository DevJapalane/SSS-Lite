import { useId, type CSSProperties } from 'react'
import { bodies, getBodyById, type BodyId } from '../data/bodies'
import { useAppStore, type CompareSlot } from '../store/useAppStore'
import { MASS_AXIS, massBarFraction, massComparisonText, sizeComparisonText } from '../utils/compare'
import { formatDecimal, formatScientific, toSuperscript } from '../utils/format'
import styles from './ComparePanel.module.css'
import { PanelCard } from './PanelCard'

const SLOTS: { slot: CompareSlot; label: string }[] = [
  { slot: 'a', label: 'Corpo A' },
  { slot: 'b', label: 'Corpo B' },
]

const DECADES = MASS_AXIS.maxExponent - MASS_AXIS.minExponent

/** Size (PB06) and mass (PB08) comparison of two bodies. */
export function ComparePanel() {
  const compare = useAppStore((s) => s.compare)
  const setCompareBody = useAppStore((s) => s.setCompareBody)
  const pair = SLOTS.map(({ slot, label }) => ({ slot, label, body: getBodyById(compare[slot]) }))
  const [a, b] = [pair[0].body, pair[1].body]
  const selectId = useId()
  const sizeId = useId()
  const massId = useId()

  return (
    <PanelCard title={`${a.name} × ${b.name}`}>
      <div className={styles.selectors}>
        {pair.map(({ slot, label, body }) => (
          <div key={slot} className={styles.field}>
            <label htmlFor={`${selectId}-${slot}`}>{label}</label>
            {/* Native select: the phone opens its own picker, accessible
                and with zero extra code or bundle size. */}
            <select
              id={`${selectId}-${slot}`}
              className={styles.select}
              value={body.id}
              onChange={(event) => setCompareBody(slot, event.target.value as BodyId)}
            >
              {bodies.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <section className={styles.block} aria-labelledby={sizeId}>
        <h3 id={sizeId} className={styles.blockTitle}>
          Tamanho
        </h3>
        {/* aria-live: when a selector changes, screen readers read the new
            sentence without the user having to look for it. */}
        <p className={styles.sentence} aria-live="polite">
          {sizeComparisonText(a, b)}
        </p>
        <dl className={styles.values}>
          {pair.map(({ slot, body }) => (
            <div key={slot} className={styles.valueRow}>
              <dt>{body.name}</dt>
              <dd>{formatDecimal(body.radiusKm * 2)} km</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.block} aria-labelledby={massId}>
        <h3 id={massId} className={styles.blockTitle}>
          Massa
        </h3>
        <p className={styles.sentence} aria-live="polite">
          {massComparisonText(a, b)}
        </p>
        <ul className={styles.bars}>
          {pair.map(({ slot, body }) => (
            <li key={slot} className={styles.bar}>
              <span className={styles.barLabel}>
                <span>{body.name}</span>
                <span className={styles.barValue}>{formatScientific(body.massKg)} kg</span>
              </span>
              {/* Decorative: the exact values are in the text above. */}
              <span
                className={styles.track}
                style={{ '--decades': DECADES } as CSSProperties}
                aria-hidden="true"
              >
                <span
                  className={styles.fill}
                  style={{ width: `${massBarFraction(body.massKg) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.axis} aria-hidden="true">
          <span>10{toSuperscript(MASS_AXIS.minExponent)} kg</span>
          <span>10{toSuperscript(MASS_AXIS.maxExponent)} kg</span>
        </div>
        <p className={styles.legend}>
          Escala logarítmica: cada divisão da barra representa 10 vezes mais massa que a
          anterior.
        </p>
      </section>
    </PanelCard>
  )
}
