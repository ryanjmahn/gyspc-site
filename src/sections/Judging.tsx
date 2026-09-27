import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { TBA } from '../components/TBA'
import { judging, prizes, sections } from '../content/site'
import styles from './Judging.module.css'

/** §06 — a ruled two-column table: criteria on the left, prizes on the right. */
export function Judging() {
  const { id, index, title, accent, symbol } = sections.judging
  return (
    <section id={id} className={`section accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />

        <div className={styles.table}>
          <Reveal className={styles.col} index={0}>
            <h3 className={styles.colHead}>
              <span className={styles.colNo}>A.</span> Judging criteria
            </h3>
            {judging.criteria.length === 0 ? (
              <p className={styles.row}>
                <TBA label="criteria" />
              </p>
            ) : (
              <ol className={styles.rows}>
                {judging.criteria.map((c, i) => (
                  <li key={c} className={styles.row}>
                    <span className={styles.rowNo}>{String(i + 1).padStart(2, '0')}</span> {c}
                  </li>
                ))}
              </ol>
            )}
            <p className={styles.aside}>{judging.note}</p>
          </Reveal>

          <Reveal className={styles.col} index={1}>
            <h3 className={styles.colHead}>
              <span className={styles.colNo}>B.</span> Prizes
            </h3>
            {prizes.length === 0 ? (
              <p className={styles.row}>
                <TBA label="prizes" />
              </p>
            ) : (
              <ul className={styles.rows}>
                {prizes.map((p) => (
                  <li key={p.title} className={styles.row}>
                    <strong className={styles.prize}>{p.title}</strong>
                    <span>{p.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>

        {judging.judges.length > 0 ? (
          <div className={styles.judges}>
            <h3 className={styles.colHead}>Judges</h3>
            <ul className={styles.judgeList}>
              {judging.judges.map((j) => (
                <li key={j.name}>
                  <span className={styles.judgeName}>{j.name}</span>
                  <span className={styles.judgeAff}>{j.affiliation}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
