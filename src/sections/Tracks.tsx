import { useRef } from 'react'
import { DitherField } from '../components/DitherField'
import { SdgTiles } from '../components/SdgTiles'
import { SectionHeader } from '../components/SectionHeader'
import {
  sdgNote,
  sections,
  signalCaption,
  tracks,
  tracksFootnote,
  type Track,
} from '../content/site'
import { useHydrated } from '../hooks/useHydrated'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { illustrations } from '../illustrations'
import styles from './Tracks.module.css'

function TrackRow({ track, index }: { track: Track; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const { play, reduced } = useInViewOnce(ref, 0.3)
  const Illustration = illustrations[track.illustration]
  const hydrated = useHydrated()
  const titleId = `track-${track.id}-title`

  return (
    <li
      ref={ref}
      id={`track-${track.id}`}
      className={`${styles.track} accent-${track.accent} ${index % 2 ? styles.flip : ''}`}
      aria-labelledby={titleId}
    >
      <div className={styles.text}>
        <p className={styles.trackNo}>Track {String(index + 1).padStart(2, '0')}</p>
        <h3 id={titleId} className={styles.name}>
          {track.name}
        </h3>
        <p className={styles.topics}>
          <span className="sr-only">Topics: </span>
          {track.topics.map((t, i) => (
            <span key={t}>
              {i > 0 ? <span className={styles.sep}> / </span> : null}
              <span className={styles.topic}>{t}</span>
            </span>
          ))}
        </p>
        <p className={styles.question}>{track.question}</p>
        <SdgTiles goals={track.sdgs} />
      </div>
      <figure className={styles.figure}>
        {hydrated ? (
          <Illustration label={track.illustrationLabel} play={play} reduced={reduced} />
        ) : (
          <div
            className={styles.illustrationSlot}
            role="img"
            aria-label={track.illustrationLabel}
          />
        )}
      </figure>
    </li>
  )
}

/** §02 — not a card grid: a vertical list of tracks, illustration alternating sides. */
export function Tracks() {
  const { id, index, title, accent, symbol } = sections.tracks
  return (
    <section id={id} className={`section accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className={styles.signal}>
        <DitherField height="8.5rem" density={0.42} particles={70} />
        <p className={`container ${styles.signalCaption}`} aria-hidden="true">
          <span>{signalCaption}</span>
        </p>
      </div>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        <p className={styles.caption}>
          {tracks.length} tracks
          <sup>
            <a href="#tracks-footnote" aria-label="Footnote 1">
              1
            </a>
          </sup>
        </p>
        <ol className={styles.list}>
          {tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} />
          ))}
        </ol>
        <p id="tracks-footnote" className={styles.footnote}>
          <sup>1</sup> {tracksFootnote}
        </p>
        <p id="sdg-note" className={styles.footnote}>
          <sup>2</sup> {sdgNote}
        </p>
      </div>
    </section>
  )
}
