import { Crowd } from '../components/Crowd'
import { DitherField } from '../components/DitherField'
import { PolicySymbol } from '../components/PolicySymbol'
import { RegisterButton } from '../components/RegisterButton'
import { Stripe } from '../components/Stripe'
import { TBA } from '../components/TBA'
import { closing, contact, isTBA, sections } from '../content/site'
import styles from './ClosingCTA.module.css'

/** §09 — full-width closing band: one line, register, contact. */
export function ClosingCTA() {
  const { id, index, accent, symbol } = sections.register
  return (
    <section
      id={id}
      className={`band accent-${accent} ${styles.band}`}
      aria-labelledby={`${id}-title`}
    >
      <DitherField className={styles.field} height="100%" density={0.3} particles={40} />
      <div className={`container ${styles.inner}`}>
        <p className={styles.index}>
          <PolicySymbol name={symbol} size={26} className={styles.symbol} />§{index}
        </p>
        <h2 id={`${id}-title`} className={styles.line}>
          {closing.line}
        </h2>
        <div className={styles.actions}>
          <RegisterButton />
          <p className={styles.contact}>
            <span className="label">Contact</span>{' '}
            {isTBA(contact.email) ? (
              <TBA label="email" />
            ) : (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            )}
          </p>
        </div>
      </div>
      <div className={`container ${styles.crowd}`}>
        <Crowd label={closing.crowdLabel} />
      </div>
      <Stripe />
    </section>
  )
}
