import { HostMark } from '../components/HostMark'
import { LogoBelt } from '../components/LogoBelt'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { MaybeText } from '../components/TBA'
import { hosts, isTBA, sections } from '../content/site'
import styles from './Hosts.module.css'

/** §07 — two mirrored blocks, one per host, each set in the voice it brings. */
export function Hosts() {
  const { id, index, title, accent, symbol } = sections.hosts
  return (
    <section id={id} className={`section band accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        <div className={styles.pair}>
          {hosts.map((h, i) => (
            <Reveal
              as="article"
              index={i}
              key={h.id}
              className={`${styles.host} ${styles[h.voice]}`}
            >
              <p className={styles.role}>{h.role}</p>
              <h3 className={styles.name}>
                <HostMark host={h} size="lg" />
              </h3>
              <p className={styles.desc}>
                <MaybeText value={h.description} label="description" />
              </p>
              <p className={styles.link}>
                {isTBA(h.url) ? (
                  <>
                    Website <MaybeText value={h.url} label="website" />
                  </>
                ) : (
                  <a href={h.url} target="_blank" rel="noopener noreferrer">
                    {h.url.replace(/^https?:\/\/(www\.)?/, '')}
                    <span aria-hidden="true"> ↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </p>
            </Reveal>
          ))}
        </div>
        <LogoBelt />
      </div>
    </section>
  )
}
