import { m } from 'framer-motion'
import { useRef } from 'react'
import { PolicySymbol } from '../components/PolicySymbol'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { premise, sections } from '../content/site'
import { useInViewOnce } from '../hooks/useInViewOnce'
import styles from './Premise.module.css'

/** §01 — short manifesto in the main column, the premise as a large pull quote in the margin. */
export function Premise() {
  const { id, index, title, accent, symbol } = sections.premise
  const quoteRef = useRef<HTMLElement>(null)
  const { play, reduced } = useInViewOnce(quoteRef, 0.4)

  return (
    <section id={id} className={`section band accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        <div className={styles.grid}>
          <Reveal className={styles.manifesto}>
            {premise.manifesto.map((sentence, i) => (
              <p key={i} className={i === 0 ? styles.first : undefined}>
                {sentence}
              </p>
            ))}
          </Reveal>
          <m.figure
            key={reduced ? 'static' : 'animated'}
            ref={quoteRef}
            className={styles.quote}
            initial={reduced ? false : { opacity: 0 }}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <blockquote>
              <p>{premise.pullQuote}</p>
            </blockquote>
          </m.figure>
        </div>
        <ol className={styles.process} aria-label="How an entry works">
          {premise.process.map((step, i) => (
            <Reveal as="li" index={i} key={step.label} className={styles.step}>
              <span className={styles.stepIcon}>
                <PolicySymbol name={step.symbol} size={26} />
              </span>
              <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
              <strong className={styles.stepLabel}>{step.label}</strong>
              <span className={styles.stepText}>{step.text}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
