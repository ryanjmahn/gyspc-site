import { m } from 'framer-motion'
import { useRef } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import type { SymbolName } from '../content/site'
import { PolicySymbol } from './PolicySymbol'
import styles from './SectionHeader.module.css'

type Props = {
  index: string
  title: string
  /** id for the heading, so the section can be aria-labelledby it. */
  id?: string
  /** Policy/change symbol that closes the header rule. */
  symbol?: SymbolName
}

/** `§01 ———` in mono, then the serif title. The hairline extends left→right on first view. */
export function SectionHeader({ index, title, id, symbol }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { play, reduced } = useInViewOnce(ref, 0.5)

  return (
    <div ref={ref} className={styles.header}>
      <div className={styles.meta}>
        <span className={styles.index}>§{index}</span>
        {reduced ? (
          <span className={styles.rule} />
        ) : (
          <m.span
            className={styles.rule}
            initial={{ scaleX: 0 }}
            animate={play ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          />
        )}
        {symbol ? (
          reduced ? (
            <PolicySymbol name={symbol} size={28} className={styles.symbol} />
          ) : (
            <m.span
              className={styles.symbolWrap}
              initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
              animate={play ? { opacity: 1, rotate: 0, scale: 1 } : undefined}
              transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 18 }}
            >
              <PolicySymbol name={symbol} size={28} className={styles.symbol} />
            </m.span>
          )
        ) : null}
      </div>
      <h2 id={id} className={styles.title}>
        <span className="sr-only">Section {index}: </span>
        {title}
      </h2>
    </div>
  )
}
