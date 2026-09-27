import { m } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { MaybeText } from '../components/TBA'
import { format, sections, type FormatStage } from '../content/site'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { MAP_CELLS, MAP_COLS, MAP_ROWS } from '../illustrations/worldMap'
import styles from './Format.module.css'

/* Online, anywhere: a coarse world map with a few pulsing points. The final: everyone in one room. */
const CELL = 200 / MAP_COLS
const r1 = (n: number) => Math.round(n * 10) / 10
// One path; each land cell is a zero-length square-capped stroke.
const worldPath = Array.from(
  { length: MAP_CELLS.length / 2 },
  (_, i) => `M${r1((MAP_CELLS[i * 2] + 0.5) * CELL)} ${r1((MAP_CELLS[i * 2 + 1] + 0.5) * CELL)}h0`,
).join('')
const HEIGHT = r1(MAP_ROWS * CELL)
const pulses = [0.08, 0.2, 0.33, 0.47, 0.6, 0.74, 0.88].map((f) => {
  const i = Math.floor((f * MAP_CELLS.length) / 2)
  return { x: r1((MAP_CELLS[i * 2] + 0.5) * CELL), y: r1((MAP_CELLS[i * 2 + 1] + 0.5) * CELL) }
})
const gathered = Array.from({ length: 9 }, (_, i) => ({
  x: 84 + (i % 3) * 16,
  y: 24 + Math.floor(i / 3) * 16,
}))

function Schematic({ stage }: { stage: 'prelim' | 'final' }) {
  return (
    <svg viewBox={`0 0 200 ${HEIGHT}`} className={styles.schematic} aria-hidden="true">
      {stage === 'prelim' ? (
        <>
          <path d={worldPath} className={styles.land} strokeWidth={r1(CELL * 0.62)} />
          {pulses.map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <circle r={5} className={styles.pulse} style={{ animationDelay: `${i * 0.45}s` }} />
              <circle r={2.2} className={styles.point} />
            </g>
          ))}
        </>
      ) : (
        <>
          <rect x={70} y={6} width={60} height={60} className={styles.room} />
          {gathered.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y - 4} r={2.8} className={styles.point} />
          ))}
        </>
      )}
    </svg>
  )
}

function Stage({ stage, index }: { stage: FormatStage; index: number }) {
  return (
    <Reveal className={styles.stage} index={index}>
      <Schematic stage={stage.id === 'prelim' ? 'prelim' : 'final'} />
      <p className={styles.stageNo}>{stage.stage}</p>
      <h3 className={styles.name}>{stage.name}</h3>
      <dl className={styles.facts}>
        {stage.facts.map((f) => (
          <div key={f.label} className={styles.fact}>
            <dt>{f.label}</dt>
            <dd>
              <MaybeText value={f.value} label={f.label} />
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}

/** §03 — the two-stage format, framed as a figure. */
export function Format() {
  const { id, index, title, accent, symbol } = sections.format
  const ref = useRef<HTMLDivElement>(null)
  const { play, reduced } = useInViewOnce(ref, 0.3)
  const [prelim, final] = format.stages

  return (
    <section id={id} className={`section band accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        <figure className={styles.figure} aria-labelledby="fig-format">
          <div ref={ref} className={styles.diagram}>
            <Stage stage={prelim} index={0} />
            <div className={styles.arrow} aria-hidden="true">
              <span className={styles.arrowH}>
                <m.span
                  key={reduced ? 'static' : 'animated'}
                  className={styles.shaft}
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={play ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
                <svg viewBox="0 0 12 16" className={styles.head}>
                  <path d="M 2 2 L 10 8 L 2 14" className={styles.arrowLine} />
                </svg>
              </span>
              <svg viewBox="0 0 24 64" className={styles.arrowV}>
                <path d="M 12 2 V 58 M 5 50 L 12 60 L 19 50" className={styles.arrowLine} />
              </svg>
            </div>
            <Stage stage={final} index={2} />
          </div>
          <figcaption id="fig-format" className={styles.caption}>
            Fig. 1 — {format.figureCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
