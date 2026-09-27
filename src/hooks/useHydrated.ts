import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/** False during prerender and hydration, true afterwards. Lets heavy decorative SVG skip the HTML. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
