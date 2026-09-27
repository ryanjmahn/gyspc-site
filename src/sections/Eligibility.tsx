import { MarginNote } from '../components/MarginNote'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { MaybeText } from '../components/TBA'
import { eligibility, rulesNote, sections, submission, type Fact } from '../content/site'
import styles from './Eligibility.module.css'

function Column({ heading, facts, index }: { heading: string; facts: Fact[]; index: number }) {
  return (
    <Reveal className={styles.column} index={index}>
      <h3 className={styles.heading}>{heading}</h3>
      <dl className={styles.list}>
        {facts.map((f, i) => (
          <div key={f.label} className={styles.item}>
            <dt>
              <span className={styles.letter} aria-hidden="true">
                ({String.fromCharCode(97 + i)})
              </span>{' '}
              {f.label}
            </dt>
            <dd>
              <MaybeText value={f.value} label={f.label} />
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}

/** §05 — two narrow columns of rules, with a margin note while they're still pending. */
export function Eligibility() {
  const { id, index, title, accent, symbol } = sections.eligibility
  return (
    <section id={id} className={`section band accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        <div className="manuscript">
          <div className={styles.columns}>
            <Column heading={eligibility.heading} facts={eligibility.facts} index={0} />
            <Column heading={submission.heading} facts={submission.facts} index={1} />
          </div>
          <MarginNote marker="Note">{rulesNote}</MarginNote>
        </div>
      </div>
    </section>
  )
}
