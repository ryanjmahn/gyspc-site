import { m, type Variants } from 'framer-motion'
import { IllustrationSvg, type IllustrationProps } from './IllustrationSvg'
import { RED_DELAY, inkLayer, redStroke, seeded } from './shared'
import styles from './Illustration.module.css'

/* Street grid: block columns / rows (x or y start, size). Streets are the gaps. */
const COLS: [number, number][] = [
  [24, 92],
  [134, 110],
  [262, 86],
  [366, 70],
  [454, 82],
]
const ROWS: [number, number][] = [
  [24, 74],
  [116, 92],
  [226, 70],
  [314, 82],
]
const STREET = 18

/** Blocks subdivided into lots, so the grid isn't uniform. Keyed "col,row". */
const SPLITS: Record<string, 'h' | 'v'> = {
  '0,1': 'h',
  '1,0': 'v',
  '2,2': 'v',
  '3,1': 'h',
  '4,3': 'v',
  '1,3': 'h',
}

/** The block the policy layer circles. */
const FOCUS = { col: 1, row: 1 }

/** Cameras sit at street intersections; each casts a fan of sightlines (degrees). */
const CAMERAS = [
  { x: 125, y: 107, angles: [20, 45, 70] },
  { x: 357, y: 217, angles: [160, 190, 220] },
  { x: 445, y: 107, angles: [95, 125, 155] },
]
const SIGHT = 130

const rand = seeded(42)
const people: { x: number; y: number }[] = []
// Scatter people along the streets.
for (let i = 0; i < 70; i++) {
  const vertical = rand() > 0.5
  if (vertical) {
    const c = Math.floor(rand() * (COLS.length - 1))
    const x = COLS[c][0] + COLS[c][1] + 4 + rand() * (STREET - 8)
    people.push({ x, y: 24 + rand() * 372 })
  } else {
    const r = Math.floor(rand() * (ROWS.length - 1))
    const y = ROWS[r][0] + ROWS[r][1] + 4 + rand() * (STREET - 8)
    people.push({ x: 24 + rand() * 512, y })
  }
}

const sightline: Variants = {
  hidden: (c: { x: number; y: number }) => ({ x2: c.x, y2: c.y, opacity: 0 }),
  shown: (c: { x: number; y: number; ex: number; ey: number; i: number }) => ({
    x2: c.ex,
    y2: c.ey,
    opacity: 1,
    transition: { delay: RED_DELAY + c.i * 0.05, duration: 0.5, ease: 'easeOut' },
  }),
}

/** Future Society — a street grid with people; red sightlines and one circled block. */
export function CitySurveillance(props: IllustrationProps) {
  const [fx, fw] = COLS[FOCUS.col]
  const [fy, fh] = ROWS[FOCUS.row]
  const pad = 14
  let k = 0

  return (
    <IllustrationSvg {...props}>
      <m.g variants={inkLayer} aria-hidden="true">
        {COLS.flatMap(([x, w], ci) =>
          ROWS.map(([y, h], ri) => {
            const split = SPLITS[`${ci},${ri}`]
            return (
              <g key={`${ci}-${ri}`}>
                <rect x={x} y={y} width={w} height={h} className={styles.paperFill} />
                {split === 'h' ? (
                  <line x1={x} x2={x + w} y1={y + h / 2} y2={y + h / 2} className={styles.ink} />
                ) : null}
                {split === 'v' ? (
                  <line x1={x + w / 2} x2={x + w / 2} y1={y} y2={y + h} className={styles.ink} />
                ) : null}
              </g>
            )
          }),
        )}
        {people.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.4} className={styles.inkFill} />
        ))}
        {CAMERAS.map((c, i) => (
          <g key={i}>
            <rect x={c.x - 5} y={c.y - 5} width={10} height={10} className={styles.inkFill} />
          </g>
        ))}
        <text x={24} y={416} className={styles.mono}>
          PLAN · CAMERAS ■ · PEOPLE ●
        </text>
      </m.g>

      <g aria-hidden="true">
        {CAMERAS.flatMap((c) =>
          c.angles.map((a) => {
            const rad = (a * Math.PI) / 180
            const custom = {
              x: c.x,
              y: c.y,
              ex: c.x + Math.cos(rad) * SIGHT,
              ey: c.y + Math.sin(rad) * SIGHT,
              i: k++,
            }
            return (
              <m.line
                key={`${c.x}-${a}`}
                x1={c.x}
                y1={c.y}
                variants={sightline}
                custom={custom}
                className={`${styles.red} ${styles.redDashed}`}
                strokeWidth={1.5}
              />
            )
          }),
        )}
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={3}
          d={`M ${fx + fw * 0.55} ${fy - pad} C ${fx + fw + pad * 1.6} ${fy - pad * 1.2}, ${fx + fw + pad * 1.4} ${fy + fh + pad}, ${fx + fw * 0.4} ${fy + fh + pad * 0.9} C ${fx - pad * 1.5} ${fy + fh + pad * 0.6}, ${fx - pad * 1.3} ${fy - pad * 0.8}, ${fx + fw * 0.7} ${fy - pad * 1.3}`}
        />
      </g>
    </IllustrationSvg>
  )
}
