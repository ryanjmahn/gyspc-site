import { m } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Redline.module.css'

export type RedlineMode = 'strike' | 'circle' | 'underline' | 'caret'

/* Hand-drawn strokes, written as fractions of the box they mark (w × h in real pixels). */
const PATHS: Record<RedlineMode, (w: number, h: number) => string> = {
  strike: (w, h) =>
    `M 0 ${0.6 * h} C ${0.22 * w} ${0.55 * h}, ${0.55 * w} ${0.62 * h}, ${w} ${0.5 * h}`,
  underline: (w, h) =>
    `M 0 ${0.55 * h} C ${0.2 * w} ${0.35 * h}, ${0.45 * w} ${0.7 * h}, ${0.7 * w} ${0.45 * h} S ${0.95 * w} ${0.4 * h}, ${w} ${0.5 * h}`,
  circle: (w, h) =>
    `M ${0.55 * w} ${0.05 * h} C ${0.86 * w} ${0.03 * h}, ${w} ${0.28 * h}, ${0.98 * w} ${0.52 * h} C ${0.96 * w} ${0.83 * h}, ${0.62 * w} ${0.97 * h}, ${0.38 * w} ${0.95 * h} C ${0.11 * w} ${0.92 * h}, ${0.01 * w} ${0.68 * h}, ${0.03 * w} ${0.44 * h} C ${0.05 * w} ${0.17 * h}, ${0.3 * w} ${0.03 * h}, ${0.66 * w} ${0.07 * h}`,
  caret: (w, h) => `M ${0.04 * w} ${0.96 * h} L ${0.5 * w} ${0.08 * h} L ${0.96 * w} ${0.96 * h}`,
}

/** Pixel size of the overlay, so strokes are drawn unstretched (keeps pathLength dashes intact). */
function useBoxSize(ref: React.RefObject<SVGSVGElement | null>) {
  const [size, setSize] = useState({ w: 100, h: 100 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width && r.height) setSize({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

type Props = {
  mode: RedlineMode
  children: ReactNode
  /** 'load' draws on mount (hero); 'inview' draws the first time it scrolls into view. */
  trigger?: 'load' | 'inview'
  /** Seconds before drawing starts. */
  delay?: number
  /** Seconds the stroke takes to draw. */
  duration?: number
  className?: string
}

/**
 * A blue-pencil editorial mark — strike, circle, underline or insertion caret — drawn over its children.
 * The mark colour means a policy decision is being made; don't use this for decoration.
 */
export function Redline({
  mode,
  children,
  trigger = 'inview',
  delay = 0,
  duration = 0.5,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { w, h } = useBoxSize(svgRef)
  const d = PATHS[mode](w, h)
  const reduced = useReducedMotion()
  const { play: inView } = useInViewOnce(ref, 0.6)
  const play = reduced || trigger === 'load' || inView
  const drawn = { pathLength: 1, opacity: 1 }

  const stroke = reduced ? (
    <path d={d} className={styles.stroke} />
  ) : (
    <m.path
      d={d}
      className={styles.stroke}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={play ? drawn : undefined}
      transition={{
        pathLength: { delay, duration, ease: [0.65, 0, 0.35, 1] },
        opacity: { delay, duration: 0.01 },
      }}
    />
  )

  const content =
    mode === 'caret' && !reduced ? (
      <m.span
        className={styles.inserted}
        initial={{ opacity: 0, y: '0.15em' }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: delay + duration * 0.6, duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </m.span>
    ) : (
      children
    )

  return (
    <span ref={ref} className={[styles.root, styles[mode], className].filter(Boolean).join(' ')}>
      {content}
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden="true"
        focusable="false"
      >
        {stroke}
      </svg>
    </span>
  )
}
