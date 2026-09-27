import { hero, tracks } from '../content/site'
import styles from './IssuesBelt.module.css'

const items = tracks.flatMap((t) =>
  t.topics.map((topic) => ({ topic, accent: t.accent, track: t.name })),
)

/** A slow ticker of the global issues the tracks cover, each keyed to its track's colour. */
export function IssuesBelt() {
  const row = (copy: boolean) =>
    items.map((it) => (
      <li
        key={`${it.topic}-${copy}`}
        className={`${styles.item} accent-${it.accent}`}
        aria-hidden={copy || undefined}
      >
        <span className={styles.dot} />
        {it.topic}
      </li>
    ))
  return (
    <div className={styles.belt}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.label}>{hero.issuesLabel}</p>
        <div className={styles.viewport}>
          <ul
            className={styles.track}
            aria-label={`${hero.issuesLabel}: ${items.map((i) => i.topic).join(', ')}`}
          >
            {row(false)}
            {row(true)}
          </ul>
        </div>
      </div>
    </div>
  )
}
