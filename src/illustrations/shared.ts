import type { Variants } from 'framer-motion'

/** Every illustration shares one coordinate box, so strokes and labels match across tracks. */
export const VIEWBOX = '0 0 560 420'

/** Science layer: ink fades in first. */
export const inkLayer: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

/** Delay before the policy layer starts: after the ink layer, plus ~300ms. */
export const RED_DELAY = 0.9

/** Policy layer: red strokes draw themselves on after the ink. */
export const redStroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: RED_DELAY + i * 0.15, duration: 0.6, ease: [0.65, 0, 0.35, 1] },
      opacity: { delay: RED_DELAY + i * 0.15, duration: 0.01 },
    },
  }),
}

/** Policy-layer text (handwritten notes, inserted codons) appears once its stroke is down. */
export const redText: Variants = {
  hidden: { opacity: 0 },
  shown: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: RED_DELAY + 0.5 + i * 0.15, duration: 0.4 },
  }),
}

/** Small deterministic PRNG so "random" scatter is identical on every render. */
export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
