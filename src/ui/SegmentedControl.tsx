import styles from './SegmentedControl.module.css'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  /** Announced by screen readers as the name of the group. */
  ariaLabel: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}

/**
 * Two or more mutually exclusive buttons (view mode, unit). Plain buttons
 * with aria-pressed: each one is reachable with Tab and states clearly
 * whether it is on, without the extra keyboard rules of a radio group.
 */
export function SegmentedControl<T extends string>({ ariaLabel, options, value, onChange }: Props<T>) {
  return (
    <div className={styles.group} role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
