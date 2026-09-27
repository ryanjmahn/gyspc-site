import { m } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import styles from './MarginNote.module.css'

type Props = {
  children: ReactNode
  /** Mono marker shown above the note, e.g. "note" or "†". */
  marker?: string
  className?: string
}

/**
 * Humanistic reflection written in the margin. Sits in the manuscript's margin column on desktop,
 * becomes an indented aside on mobile. Fades in shortly after the section's main content.
 */
export function MarginNote({ children, marker, className }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { play, reduced } = useInViewOnce(ref, 0.4)
  const cls = ['margin', styles.note, className].filter(Boolean).join(' ')

  const body = (
    <>
      {marker ? <span className={styles.marker}>{marker}</span> : null}
      <p className={styles.text}>{children}</p>
    </>
  )

  if (reduced) {
    return (
      <aside ref={ref} className={cls}>
        {body}
      </aside>
    )
  }
  return (
    <m.aside
      ref={ref}
      className={cls}
      initial={{ opacity: 0 }}
      animate={play ? { opacity: 1 } : undefined}
      transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
    >
      {body}
    </m.aside>
  )
}
