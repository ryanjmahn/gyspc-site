import { sdgLabel, sdgs } from '../content/site'
import styles from './SdgTiles.module.css'

/** UN SDG goal tiles (number in the goal's official colour + its name). */
export function SdgTiles({ goals }: { goals: number[] }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.label}>
        {sdgLabel}
        <sup>
          <a href="#sdg-note" aria-label="Footnote 2: about the SDG links">
            2
          </a>
        </sup>
      </p>
      <ul className={styles.tiles}>
        {goals.map((n) => {
          const g = sdgs[n]
          return (
            <li key={n} className={styles.tile}>
              <span
                className={styles.num}
                style={{ background: g.color, color: g.darkText ? '#0b1f3a' : '#fff' }}
                aria-hidden="true"
              >
                {n}
              </span>
              <span className={styles.name}>
                <span className="sr-only">Goal {n}: </span>
                {g.name}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
