import { useState } from 'react'
import { Button } from '../components/Button'
import { Globe } from '../components/Globe'
import { HostMark } from '../components/HostMark'
import { MarginNote } from '../components/MarginNote'
import { Redline } from '../components/Redline'
import { RegisterButton } from '../components/RegisterButton'
import { hero, heroDataLine, hosts, identity, tracks } from '../content/site'

const trackAccents = tracks.map((t) => t.accent)
import styles from './Hero.module.css'

/** §00 — the headline as an edit in progress: a phrase struck out and a better one inserted. */
export function Hero() {
  const { lead, struck, inserted } = hero.headline
  const [activeTrack, setActiveTrack] = useState<number | null>(null)

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.main}>
          <p className={`label ${styles.kicker}`}>
            §00 — {identity.shortName} {identity.cycle}
          </p>
          <h1 id="hero-title" className={styles.headline}>
            <span className={styles.lead}>{lead}</span>{' '}
            <del className={styles.struck}>
              <Redline mode="strike" trigger="load" delay={0.25} duration={0.45}>
                {struck}
              </Redline>
            </del>{' '}
            <ins className={styles.inserted}>
              <Redline mode="caret" trigger="load" delay={0.75} duration={0.25}>
                {inserted}
              </Redline>
            </ins>
          </h1>

          <p className={styles.lede}>{hero.lede}</p>
          <p className={styles.data}>{heroDataLine}</p>

          <div className={styles.ctas}>
            <RegisterButton />
            <Button variant="ghost" href={`#${hero.secondaryCta.section}`}>
              {hero.secondaryCta.label} <span aria-hidden="true">↓</span>
            </Button>
          </div>
        </div>

        <div className={styles.aside}>
          <Globe label={hero.globeLabel} satellites={trackAccents} active={activeTrack} />
          <p className={styles.hint} aria-hidden="true">
            ↔ {hero.globeHint}
          </p>
          <ul className={styles.legend} aria-label="Tracks">
            {tracks.map((t, i) => (
              <li
                key={t.id}
                className={`accent-${t.accent}`}
                onPointerEnter={() => setActiveTrack(i)}
                onPointerLeave={() => setActiveTrack(null)}
                onFocus={() => setActiveTrack(i)}
                onBlur={() => setActiveTrack(null)}
              >
                <span className={styles.legendDot} aria-hidden="true" />
                <a href={`#track-${t.id}`}>{t.name}</a>
              </li>
            ))}
          </ul>
          <MarginNote marker="Margin note" className={styles.note}>
            {hero.marginNote}
          </MarginNote>
        </div>

        <div className={styles.hosted}>
          <span className="label">Hosted by</span>
          <span className={styles.hostList}>
            {hosts.map((h, i) => (
              <span key={h.id} className={styles.hostItem}>
                {i > 0 ? (
                  <span className={styles.times} aria-label="and">
                    ×
                  </span>
                ) : null}
                <HostMark host={h} />
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}
