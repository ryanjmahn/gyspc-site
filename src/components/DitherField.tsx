import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './DitherField.module.css'

type Props = {
  /** CSS height of the band, e.g. '10rem'. */
  height?: string
  /** Cell size in CSS pixels. */
  cell?: number
  /** Overall density of the field (0–1). */
  density?: number
  /** Number of drifting particles drawn over the field. */
  particles?: number
  className?: string
}

/* 8×8 Bayer matrix, normalised to 0–1 thresholds. */
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64)

/**
 * The science layer as texture: an ordered-dither rendering of interfering waves, with particles
 * drifting through the flow. The pointer raises the field and pushes particles away.
 * Colour comes from the surrounding section's --accent. Decorative; static under reduced motion.
 */
export function DitherField({
  height = '9rem',
  cell = 6,
  density = 0.5,
  particles = 60,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let W = 0
    let H = 0
    let raf = 0
    let visible = false
    let color = ''
    let ink = ''
    const pointer = { x: -1e4, y: -1e4, strength: 0 }
    let parts: { x: number; y: number; vx: number; vy: number }[] = []
    const start = performance.now()

    const readColor = () => {
      const cs = getComputedStyle(canvas)
      color = cs.getPropertyValue('--accent').trim() || cs.color
      ink = cs.getPropertyValue('--ink').trim()
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (parts.length === 0) {
        parts = Array.from({ length: particles }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: 0,
          vy: 0,
        }))
      }
    }

    /* Field value 0–1: two travelling waves interfering, plus a bump under the pointer. */
    const field = (x: number, y: number, t: number) => {
      const a = Math.sin(x * 0.011 + t * 0.0006) * Math.cos(y * 0.035 - t * 0.0004)
      const b = Math.sin((x + y) * 0.006 - t * 0.0003)
      let v = 0.5 + 0.28 * a + 0.22 * b
      v += (density - 0.5) * 0.8
      // Fade towards the edges of the band.
      v *= Math.min(1, (y / H) * 3, ((H - y) / H) * 3)
      if (pointer.strength > 0) {
        const dx = x - pointer.x
        const dy = y - pointer.y
        v += pointer.strength * 0.55 * Math.exp(-(dx * dx + dy * dy) / 5000)
      }
      return v
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = color
      const cols = Math.ceil(W / cell)
      const rows = Math.ceil(H / cell)
      const size = cell * 0.62
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cell + cell / 2
          const y = r * cell + cell / 2
          if (field(x, y, t) > BAYER[(r % 8) * 8 + (c % 8)]) {
            ctx.fillRect(x - size / 2, y - size / 2, size, size)
          }
        }
      }

      // Particles follow the field's flow and are pushed away from the pointer.
      ctx.fillStyle = ink
      for (const p of parts) {
        if (!reduced) {
          const angle = Math.sin(p.x * 0.004 + t * 0.0002) * Math.PI + Math.cos(p.y * 0.01) * 0.8
          p.vx += Math.cos(angle) * 0.02
          p.vy += Math.sin(angle) * 0.02
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < 9000) {
            const f = (1 - d2 / 9000) * 0.6
            const d = Math.sqrt(d2) || 1
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
          p.vx *= 0.94
          p.vy *= 0.94
          p.x += p.vx + 0.25
          p.y += p.vy
          if (p.x > W + 4) p.x = -4
          if (p.x < -4) p.x = W + 4
          if (p.y > H + 4) p.y = -4
          if (p.y < -4) p.y = H + 4
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (now: number) => {
      if (visible) {
        pointer.strength *= 0.96
        draw(now - start)
      }
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.strength = 1
    }
    const onLeave = () => {
      pointer.x = -1e4
      pointer.y = -1e4
    }

    readColor()
    resize()
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now() - start)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(canvas)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', readColor)

    if (reduced) {
      draw(0)
    } else {
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mql.removeEventListener('change', readColor)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, cell, density, particles])

  return (
    <canvas
      ref={ref}
      className={[styles.field, className].filter(Boolean).join(' ')}
      style={{ height }}
      aria-hidden="true"
    />
  )
}
