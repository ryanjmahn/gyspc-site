import { isTBA, type Maybe } from '../content/site'
import styles from './TBA.module.css'

type Props = {
  /** What is still to be announced — read out to screen readers, e.g. "Prizes". */
  label?: string
  className?: string
}

/** A deliberate placeholder for facts that aren't public yet. */
export function TBA({ label, className }: Props) {
  return (
    <span className={[styles.tba, className].filter(Boolean).join(' ')}>
      <span aria-hidden="true">
        [&nbsp;TBA{label ? <span className={styles.what}>: {label}</span> : null}&nbsp;]
      </span>
      <span className="sr-only">{label ? `${label}: ` : ''}to be announced</span>
      <span className={styles.tip} aria-hidden="true">
        Announced soon
      </span>
    </span>
  )
}

/** Renders the value, or a TBA placeholder while it's still unknown. */
export function MaybeText({ value, label }: { value: Maybe<string>; label?: string }) {
  return isTBA(value) ? <TBA label={label} /> : <>{value}</>
}
