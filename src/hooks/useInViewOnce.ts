import { useInView } from 'framer-motion'
import { type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Scroll trigger shared by every animated element: fires once when the element is ~20% visible.
 * Under reduced motion it reports "in view" immediately so final states render with no animation.
 */
export function useInViewOnce(ref: RefObject<Element | null>, amount = 0.2) {
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, amount })
  return { play: reduced || inView, reduced }
}
