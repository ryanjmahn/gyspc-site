import { useRef, type CSSProperties } from 'react'
import type { Accent } from '../content/site'
import { useHydrated } from '../hooks/useHydrated'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { seeded } from '../illustrations/shared'
import styles from './Crowd.module.css'

const COLORS: (Accent | 'ink')[] = [
  'blue',
  'green',
  'amber',
  'magenta',
  'teal',
  'orange',
  'purple',
  'ink',
]
const COUNT = 46
const W = 1200
const H = 120

/* A deterministic crowd: varied heights, widths and colours, standing on one baseline. */
const rand = seeded(2027)
const people = Array.from({ length: COUNT }, (_, i) => {
  const h = 62 + rand() * 46 // total figure height
  const w = 18 + rand() * 8 // shoulder width
  const x = (i + 0.5) * (W / COUNT) + (rand() - 0.5) * 8
  const color = COLORS[Math.floor(rand() * COLORS.length)]
  return { x, h, w, color }
})

/** Society, drawn as a row of people in every colour of the palette. */
export function Crowd({ label }: { label: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const { play } = useInViewOnce(ref, 0.3)
  const hydrated = useHydrated()
  return (
    <svg
      ref={ref}
      className={`${styles.crowd} ${play ? '' : styles.waiting}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label={label}
    >
      {hydrated &&
        people.map((p, i) => {
          const head = p.w * 0.36
          const bodyTop = H - p.h + head * 2 + 3
          const fill = p.color === 'ink' ? 'var(--ink)' : `var(--c-${p.color})`
          return (
            <g key={i} fill={fill} className={styles.person} style={{ '--i': i } as CSSProperties}>
              <circle cx={p.x} cy={H - p.h + head} r={head} />
              <path
                d={`M ${p.x - p.w / 2} ${H} V ${bodyTop + p.w / 2} a ${p.w / 2} ${p.w / 2} 0 0 1 ${p.w} 0 V ${H} Z`}
              />
            </g>
          )
        })}
    </svg>
  )
}
