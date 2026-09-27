import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { VIEWBOX } from './shared'
import styles from './Illustration.module.css'

export type IllustrationProps = { label: string; play: boolean; reduced: boolean }

/** Root <svg> for a plate. Children opt into the ink → red sequence through shared variants. */
export function IllustrationSvg({
  label,
  play,
  reduced,
  children,
}: IllustrationProps & { children: ReactNode }) {
  return (
    <m.svg
      key={reduced ? 'static' : 'animated'}
      viewBox={VIEWBOX}
      className={styles.svg}
      role="img"
      aria-label={label}
      initial={reduced ? false : 'hidden'}
      animate={play ? 'shown' : 'hidden'}
    >
      {children}
    </m.svg>
  )
}
