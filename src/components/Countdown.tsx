import { animate, m, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { countdown, type Milestone } from '../content/site'
import { useInViewOnce } from '../hooks/useInViewOnce'
import styles from './Countdown.module.css'

const DAY = 86_400_000

/** "Registration opens in 4 days" — counts up to the number the first time it scrolls into view. */
export function Countdown({ milestone, today }: { milestone: Milestone; today: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { play, reduced } = useInViewOnce(ref, 0.6)
  const during = !!milestone.startsOn && milestone.startsOn <= today
  const days = milestone.startsOn
    ? Math.max(0, Math.round((Date.parse(milestone.startsOn) - Date.parse(today)) / DAY))
    : null

  const value = useMotionValue(reduced || days === null ? (days ?? 0) : 0)
  const shown = useTransform(value, (v) => Math.round(v).toString())

  useEffect(() => {
    if (days === null) return
    if (reduced) {
      value.set(days)
      return
    }
    if (!play) return
    const controls = animate(value, days, {
      duration: Math.min(1.4, 0.4 + days * 0.02),
      ease: 'easeOut',
    })
    return () => controls.stop()
  }, [play, reduced, days, value])

  if (days === null && !during) return null
  const label = milestone.label

  return (
    <div ref={ref} className={styles.box} role="status">
      {during ? (
        <p className={styles.lead}>{countdown.during.replace('{label}', label)}</p>
      ) : (
        <>
          <p className={styles.lead}>{countdown.before.replace('{label}', label)}</p>
          <p className={styles.number}>
            <m.span>{shown}</m.span>
            <span className={styles.unit}>
              {days === 1 ? countdown.unit[0] : countdown.unit[1]}
            </span>
          </p>
        </>
      )}
    </div>
  )
}
