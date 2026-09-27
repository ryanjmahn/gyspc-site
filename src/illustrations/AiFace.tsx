import { m } from 'framer-motion'
import { IllustrationSvg, type IllustrationProps } from './IllustrationSvg'
import { inkLayer, redStroke, redText } from './shared'
import styles from './Illustration.module.css'

/* Face geometry inside the 560×420 box. */
const CX = 222
const CY = 212
const RX = 118
const RY = 156
const STEP = 10
const X0 = 60
const Y0 = 42
const COLS = 35
const ROWS = 35

const g = (u: number, v: number, mu: number, mv: number, su: number, sv: number) =>
  Math.exp(-(((u - mu) / su) ** 2 + ((v - mv) / sv) ** 2))

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Darkness 0–1 of a very simple procedural portrait: light face on a mid-tone ground, lit from the left. */
function tone(x: number, y: number) {
  const u = (x - CX) / RX
  const v = (y - CY) / RY
  const e = u * u + v * v
  if (e > 1) {
    if (v > 0.8 && Math.abs(u) < 0.36) return 0.2 + 0.25 * smooth(0.8, 1.1, v) // neck
    if (v > 1.12 && Math.abs(u) < 1.5) return 0.3 // shoulders
    if (e < 1.2 && v < 0.15) return 0.95 // hair past the head outline
    return 0.62 + 0.1 * smooth(-1, 1, -u) // backdrop, darker on the left
  }
  let d = 0.03 + 0.22 * smooth(-0.2, 1, u) // skin, shaded on the right
  d += 0.3 * smooth(0.82, 1, e) // rim shadow
  if (v < -0.5 || (Math.abs(u) > 0.82 && v < 0.2)) d = 0.92 // hair
  for (const s of [-1, 1]) {
    d += 0.9 * g(u, v, s * 0.36, -0.1, 0.14, 0.075) // eyes
    d += 0.55 * g(u, v, s * 0.36, -0.28, 0.2, 0.04) // brows
  }
  d += 0.35 * g(u, v, 0.1, 0.14, 0.06, 0.15) // nose shadow
  d += 0.35 * g(u, v, 0, 0.3, 0.12, 0.03) // nostrils
  d += 0.75 * g(u, v, 0, 0.48, 0.25, 0.045) // mouth
  return Math.min(1, d)
}

/**
 * The halftone, grouped by dot size: one path per size, each dot a zero-length round-capped stroke.
 * Keeps the prerendered HTML small (~1,200 dots in a few KB).
 */
const LEVELS = 14
const dotLayers = (() => {
  const buckets: string[] = Array.from({ length: LEVELS }, () => '')
  for (let i = 0; i < COLS * ROWS; i++) {
    const x = X0 + (i % COLS) * STEP
    const y = Y0 + Math.floor(i / COLS) * STEP
    buckets[Math.round(tone(x, y) * (LEVELS - 1))] += `M${x} ${y}h0`
  }
  return buckets
    .map((d, level) => ({ d, width: 2 * (0.5 + (level / (LEVELS - 1)) * 4.3) }))
    .filter((l) => l.d)
})()

/** AI & Digital Society — a halftone face of unverified origin; policy brackets half of it. */
export function AiFace(props: IllustrationProps) {
  const top = Y0 - 10
  const bottom = Y0 + (ROWS - 1) * STEP + 10
  const right = X0 + (COLS - 1) * STEP + 10
  return (
    <IllustrationSvg {...props}>
      <m.g variants={inkLayer} aria-hidden="true">
        {dotLayers.map((l) => (
          <path key={l.width} d={l.d} className={styles.dots} strokeWidth={l.width.toFixed(2)} />
        ))}
        {/* crop marks around the frame */}
        <path
          className={styles.ink}
          d={`M ${X0 - 16} ${top + 8} v -14 h 14 M ${right - 4} ${top - 6} h 14 v 14 M ${X0 - 16} ${bottom - 8} v 14 h 14 M ${right - 4} ${bottom + 6} h 14 v -14`}
        />
        <text x={X0 - 16} y={bottom + 32} className={styles.mono}>
          SOURCE: UNVERIFIED
        </text>
        <text x={right + 10} y={bottom + 32} className={styles.mono} textAnchor="end">
          FRAME 0001
        </text>
      </m.g>

      <g aria-hidden="true">
        {/* bracket around the right half of the face */}
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={0}
          d={`M ${CX + 12} ${top} h -12 v ${bottom - top} h 12`}
        />
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={1}
          d={`M ${right - 8} ${top} h 12 v ${bottom - top} h -12`}
        />
        {/* leader + caret to the note */}
        <m.path
          className={styles.red}
          variants={redStroke}
          custom={2}
          d={`M ${right + 6} ${CY} C ${right + 30} ${CY}, ${right + 36} ${CY - 18}, ${right + 44} ${CY - 34} L ${right + 52} ${CY - 18}`}
        />
        <m.text variants={redText} custom={2} x={right + 24} y={CY - 46} className={styles.redNote}>
          consent?
        </m.text>
      </g>
    </IllustrationSvg>
  )
}
