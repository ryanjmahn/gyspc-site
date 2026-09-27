import { m } from 'framer-motion'
import { IllustrationSvg, type IllustrationProps } from './IllustrationSvg'
import { inkLayer, redStroke, redText, seeded } from './shared'
import styles from './Illustration.module.css'

/* Plot area */
const L = 70
const R = 530
const T = 40
const B = 350
const BRANCH_X = 300

const curveY = (x: number) => B - 22 - 262 * ((x - L) / (R - L)) ** 2.2

const rand = seeded(7)
const points = Array.from({ length: 11 }, (_, i) => {
  const x = L + 10 + i * 22
  return { x, y: curveY(x) + (rand() - 0.5) * 12 }
})

const projection = Array.from({ length: 24 }, (_, i) => {
  const x = BRANCH_X + (i * (R - BRANCH_X)) / 23
  return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${curveY(x).toFixed(1)}`
}).join(' ')

const by = curveY(BRANCH_X)

/** Climate & Environmental Technology — a rising curve, and a red intervention bending it down. */
export function ClimateCurve(props: IllustrationProps) {
  return (
    <IllustrationSvg {...props}>
      <m.g variants={inkLayer} aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={L + i * 51.1}
            x2={L + i * 51.1}
            y1={T}
            y2={B}
            className={styles.grid}
          />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={L}
            x2={R}
            y1={T + i * 51.7}
            y2={T + i * 51.7}
            className={styles.grid}
          />
        ))}
        <path className={styles.ink} d={`M ${L} ${T - 6} V ${B} H ${R + 6}`} />
        {['1960', '2000', '2040', '2080'].map((year, i) => (
          <text key={year} x={L + i * 153} y={B + 24} className={styles.mono} textAnchor="middle">
            {year}
          </text>
        ))}
        <text x={R} y={B + 48} className={styles.mono} textAnchor="end">
          YEAR →
        </text>
        <text x={L - 12} y={T - 16} className={styles.mono}>
          CO₂ ↑
        </text>
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} className={styles.inkFill} />
        ))}
        <path className={`${styles.ink} ${styles.dashed}`} d={projection} />
        <text x={R - 6} y={curveY(R) - 14} className={styles.mono} textAnchor="end">
          PROJECTED
        </text>
      </m.g>

      <g aria-hidden="true">
        <m.circle
          variants={redText}
          custom={-3}
          cx={BRANCH_X}
          cy={by}
          r={5}
          className={styles.red}
        />
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={0}
          d={`M ${BRANCH_X} ${by} C ${BRANCH_X + 70} ${by - 60}, ${BRANCH_X + 130} ${by - 40}, ${R} ${by + 24}`}
        />
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={1}
          d={`M ${R - 14} ${by + 10} L ${R} ${by + 24} L ${R - 18} ${by + 28}`}
        />
        <m.text
          variants={redText}
          custom={1}
          x={BRANCH_X + 34}
          y={by + 52}
          className={styles.redNote}
        >
          at whose risk?
        </m.text>
      </g>
    </IllustrationSvg>
  )
}
