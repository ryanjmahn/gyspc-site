import { useId, type ReactNode } from 'react'
import styles from './Button.module.css'

type Props = {
  variant?: 'primary' | 'ghost'
  children: ReactNode
  href?: string
  /** When set, the button is shown but inactive, and this note explains why (hover / focus). */
  disabledNote?: string
  className?: string
}

export function Button({ variant = 'primary', children, href, disabledNote, className }: Props) {
  const tipId = useId()
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(' ')

  if (disabledNote) {
    return (
      <span className={styles.wrap}>
        <button
          type="button"
          className={`${cls} ${styles.disabled}`}
          aria-disabled="true"
          aria-describedby={tipId}
        >
          {children}
        </button>
        <span id={tipId} role="tooltip" className={styles.tip}>
          {disabledNote}
        </span>
      </span>
    )
  }

  const external = href?.startsWith('http')
  return (
    <a
      className={cls}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
