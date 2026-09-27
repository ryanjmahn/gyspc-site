import { m, useScroll, useSpring } from 'framer-motion'
import styles from './ScrollProgress.module.css'

/** A thin navy bar under the nav stripe showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return <m.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />
}
