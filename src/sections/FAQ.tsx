import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { MaybeText } from '../components/TBA'
import { faq, sections } from '../content/site'
import styles from './FAQ.module.css'

/** §08 — native <details> accordion: keyboard and screen-reader friendly with no script. */
export function FAQ() {
  const { id, index, title, accent, symbol } = sections.faq
  return (
    <section id={id} className={`section accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className={`container ${styles.layout}`}>
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        <div className={styles.list}>
          {faq.map((item, i) => (
            <Reveal key={item.question} index={i}>
              <details className={styles.item}>
                <summary className={styles.summary}>
                  <span className={styles.qNo}>Q{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.question}>{item.question}</span>
                  <span className={styles.icon} aria-hidden="true" />
                </summary>
                <div className={styles.answer}>
                  <MaybeText value={item.answer} label="answer" />
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
