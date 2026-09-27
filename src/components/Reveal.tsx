import { m } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce'

type Tag = 'div' | 'li' | 'article'

type Props = {
  children: ReactNode
  as?: Tag
  /** Position in a list, for a staggered entrance. */
  index?: number
  className?: string
  id?: string
}

/** Fades and lifts its content in the first time it scrolls into view. Static under reduced motion. */
export function Reveal({ children, as = 'div', index = 0, className, id }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { play, reduced } = useInViewOnce(ref, 0.15)

  if (reduced) {
    const Plain = as
    return (
      <Plain ref={ref as never} className={className} id={id}>
        {children}
      </Plain>
    )
  }
  const Motion = m[as]
  return (
    <Motion
      ref={ref as never}
      className={className}
      id={id}
      initial={{ opacity: 0, y: 18 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: Math.min(index, 8) * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Motion>
  )
}
