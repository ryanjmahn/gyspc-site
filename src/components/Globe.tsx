import { useEffect, useRef } from 'react'
import type { Accent } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Globe.module.css'

type Props = {
  label: string
  /** Colours of the satellites on the orbit — one per track. */
  satellites: Accent[]
  /** Index of a satellite to emphasise (e.g. while its track is hovered in the legend). */
  active?: number | null
}

const DEG = Math.PI / 180
const TILT = -18 * DEG // axial tilt towards the viewer
const ORBIT_TILT = -16 * DEG // orbit plane rotation on screen
const START = 95 * DEG // opens over Asia
const AUTO_SPIN = 0.00012 // radians per ms (~7° per second)

/** Unit vectors for every land dot, loaded after first paint so the map data stays out of the main bundle. */
let landCache: Float32Array | null = null
async function loadLand() {
  if (landCache) return landCache
  const { LAND_DOTS } = await import('../illustrations/landDots')
  const out = new Float32Array((LAND_DOTS.length / 2) * 3)
  for (let i = 0, j = 0; i < LAND_DOTS.length; i += 2, j += 3) {
    const lon = LAND_DOTS[i] * DEG
    const lat = LAND_DOTS[i + 1] * DEG
    out[j] = Math.cos(lat) * Math.sin(lon)
    out[j + 1] = Math.sin(lat)
    out[j + 2] = Math.cos(lat) * Math.cos(lon)
  }
  landCache = out
  return out
}

function readColors(el: HTMLElement, satellites: Accent[]) {
  const cs = getComputedStyle(el)
  const v = (name: string) => cs.getPropertyValue(name).trim()
  return {
    ink: v('--ink'),
    soft: v('--ink-soft'),
    ocean: v('--t-blue'),
    grid: v('--grid-line'),
    hair: v('--hairline-color'),
    sats: satellites.map((a) => v(`--c-${a}`)),
  }
}

/**
 * A dot-matrix globe (Natural Earth land) circled by an orbit carrying one satellite per track.
 * Turns slowly on its own; drag (or use ←/→ when focused) to spin it. No auto-spin under reduced motion.
 */
export function Globe({ label, satellites, active = null }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const reduced = useReducedMotion()

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let colors = readColors(canvas, satellites)
    let land: Float32Array | null = landCache
    let W = 0
    let H = 0
    let raf = 0
    let visible = true
    let spin = START
    let orbit = 0.6
    let velocity = 0 // radians per ms, from dragging
    let dragging = false
    let lastX = 0
    let lastT = 0
    let prev = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const cx = W / 2
      const cy = H / 2
      const R = Math.min(H * 0.44, W * 0.33)
      const cosS = Math.cos(spin)
      const sinS = Math.sin(spin)
      const cosT = Math.cos(TILT)
      const sinT = Math.sin(TILT)
      ctx.clearRect(0, 0, W, H)

      // Orbit ellipse (flattened circle, rotated on screen).
      const orx = R * 1.42
      const ory = R * 0.36
      const orbitPoint = (a: number) => {
        const x = Math.cos(a) * orx
        const y = Math.sin(a) * ory
        return {
          x: cx + x * Math.cos(ORBIT_TILT) - y * Math.sin(ORBIT_TILT),
          y: cy + x * Math.sin(ORBIT_TILT) + y * Math.cos(ORBIT_TILT),
          front: Math.sin(a) > 0,
        }
      }
      const drawOrbit = (from: number, to: number) => {
        ctx.beginPath()
        for (let a = from; a <= to + 0.001; a += 0.05) {
          const p = orbitPoint(a)
          if (a === from) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.strokeStyle = colors.soft
        ctx.lineWidth = 1
        ctx.setLineDash([3, 5])
        ctx.stroke()
        ctx.setLineDash([])
      }
      const sats = colors.sats.map((c, i) => ({
        c,
        i,
        ...orbitPoint(orbit + (i * Math.PI * 2) / colors.sats.length),
      }))
      const drawSats = (front: boolean) => {
        for (const s of sats) {
          if (s.front !== front) continue
          const on = activeRef.current === s.i
          const r = (front ? 6 : 4.5) * (on ? 1.7 : 1)
          if (on) {
            ctx.beginPath()
            ctx.arc(s.x, s.y, r + 6, 0, Math.PI * 2)
            ctx.strokeStyle = s.c
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
          ctx.beginPath()
          ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
          ctx.fillStyle = s.c
          ctx.fill()
        }
      }

      drawOrbit(Math.PI, Math.PI * 2)
      drawSats(false)

      // Ocean disc + rim.
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = colors.ocean
      ctx.fill()
      ctx.strokeStyle = colors.hair
      ctx.lineWidth = 1
      ctx.stroke()

      const project = (x: number, y: number, z: number) => {
        const x1 = x * cosS - z * sinS
        const z1 = x * sinS + z * cosS
        const y2 = y * cosT - z1 * sinT
        const z2 = y * sinT + z1 * cosT
        return { x: cx + x1 * R, y: cy - y2 * R, z: z2 }
      }
      const sphere = (lat: number, lon: number) =>
        project(
          Math.cos(lat * DEG) * Math.sin(lon * DEG),
          Math.sin(lat * DEG),
          Math.cos(lat * DEG) * Math.cos(lon * DEG),
        )
      const line = (pts: { x: number; y: number; z: number }[]) => {
        ctx.beginPath()
        let pen = false
        for (const p of pts) {
          if (p.z < 0) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(p.x, p.y)
          else ctx.moveTo(p.x, p.y)
          pen = true
        }
        ctx.stroke()
      }

      // Graticule every 30°.
      ctx.strokeStyle = colors.grid
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts = []
        for (let lon = -180; lon <= 180; lon += 6) pts.push(sphere(lat, lon))
        line(pts)
      }
      for (let lon = -180; lon < 180; lon += 30) {
        const pts = []
        for (let lat = -90; lat <= 90; lat += 6) pts.push(sphere(lat, lon))
        line(pts)
      }

      // Land dots, fading towards the limb.
      if (land) {
        ctx.fillStyle = colors.ink
        const r = Math.max(0.9, R / 110)
        for (let j = 0; j < land.length; j += 3) {
          const p = project(land[j], land[j + 1], land[j + 2])
          if (p.z <= 0.02) continue
          ctx.globalAlpha = 0.25 + 0.75 * p.z
          ctx.beginPath()
          ctx.arc(p.x, p.y, r * (0.6 + 0.4 * p.z), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      drawOrbit(0, Math.PI)
      drawSats(true)
    }

    const loop = (now: number) => {
      const dt = Math.min(now - prev, 50)
      prev = now
      if (visible) {
        if (!dragging) {
          spin += (reduced ? 0 : AUTO_SPIN) * dt + velocity * dt
          velocity *= Math.pow(0.994, dt) // inertia after a flick
          if (Math.abs(velocity) < 1e-6) velocity = 0
          if (!reduced) orbit += 0.00018 * dt
        }
        draw()
      }
      raf = requestAnimationFrame(loop)
    }

    // Drag to spin.
    const onDown = (e: PointerEvent) => {
      dragging = true
      velocity = 0
      lastX = e.clientX
      lastT = e.timeStamp
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dt = Math.max(e.timeStamp - lastT, 1)
      const delta = (dx / W) * Math.PI * 1.2
      spin -= delta
      velocity = -delta / dt
      lastX = e.clientX
      lastT = e.timeStamp
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
      if (reduced) velocity = 0
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        spin += (e.key === 'ArrowLeft' ? 1 : -1) * 15 * DEG
      }
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('keydown', onKey)

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onTheme = () => {
      colors = readColors(canvas, satellites)
    }
    mql.addEventListener('change', onTheme)

    if (!land) loadLand().then((l) => (land = l))
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mql.removeEventListener('change', onTheme)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('keydown', onKey)
    }
  }, [reduced, satellites])

  return (
    <canvas
      ref={ref}
      className={styles.globe}
      role="img"
      tabIndex={0}
      aria-label={`${label} Drag, or use the left and right arrow keys, to turn it.`}
    />
  )
}
