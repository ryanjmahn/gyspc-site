import { useSyncExternalStore } from 'react'
import { Countdown } from '../components/Countdown'
import { MarginNote } from '../components/MarginNote'
import { Redline } from '../components/Redline'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { MaybeText, TBA } from '../components/TBA'
import {
  identity,
  isTBA,
  sections,
  timeline,
  timelineKey,
  withStatus,
  type Milestone,
} from '../content/site'
import styles from './Timeline.module.css'

const noSubscribe = () => () => {}

function DateStamp({ m }: { m: Milestone }) {
  const date = isTBA(m.date) ? <TBA label="date" /> : m.date
  const stamp = (
    <span className={styles.stamp}>
      {date}
      {m.detail ? (
        <span className={styles.detail}>
          <MaybeText value={m.detail.value} label={m.detail.label} />
        </span>
      ) : null}
    </span>
  )
  return m.status === 'current' ? (
    <Redline mode="circle" delay={0.3} duration={0.7}>
      {stamp}
    </Redline>
  ) : (
    stamp
  )
}

/** §04 — a dated ledger. Past entries are struck through; the next one is circled in red. */
export function Timeline() {
  const { id, index, title, accent, symbol } = sections.timeline
  // Hydrate with the build day (matches the prerendered HTML), then use the visitor's today.
  const today = useSyncExternalStore(
    noSubscribe,
    () => new Date().toISOString().slice(0, 10),
    () => __BUILD_DATE__,
  )
  const items = withStatus(timeline, new Date(today))
  const current = items.find((m) => m.status === 'current')

  return (
    <section id={id} className={`section accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        <div className="manuscript">
          <div>
            <p className={styles.cycle}>{identity.cycle} cycle</p>
            <ol className={styles.ledger}>
              {items.map((m, i) => (
                <Reveal
                  as="li"
                  index={i}
                  key={m.id}
                  className={`${styles.entry} ${styles[m.status]}`}
                >
                  <span className={styles.date}>
                    <DateStamp m={m} />
                  </span>
                  <span className={styles.label}>
                    {m.status === 'past' ? <del>{m.label}</del> : m.label}
                    {m.status === 'current' ? <span className={styles.next}>← next</span> : null}
                  </span>
                  <span className="sr-only">
                    {m.status === 'past' ? '(done)' : m.status === 'current' ? '(next up)' : ''}
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="margin">
            {current ? <Countdown milestone={current} today={today} /> : null}
            <MarginNote marker="Key">{timelineKey}</MarginNote>
          </div>
        </div>
      </div>
    </section>
  )
}
