import { partnerLogos } from '../content/site'
import styles from './LogoBelt.module.css'

/** STEMise-style scrolling partner belt. Renders nothing until logos are supplied in site.ts. */
export function LogoBelt() {
  if (partnerLogos.length === 0) return null
  // Duplicated once so the loop is seamless; the copy is hidden from assistive tech.
  const row = (hidden: boolean) =>
    partnerLogos.map((logo) => (
      <li key={`${logo.name}-${hidden}`} aria-hidden={hidden || undefined}>
        {logo.href && !hidden ? (
          <a href={logo.href} target="_blank" rel="noopener noreferrer">
            <img src={logo.src} alt={logo.name} />
          </a>
        ) : (
          <img src={logo.src} alt={hidden ? '' : logo.name} />
        )}
      </li>
    ))
  return (
    <div className={styles.belt}>
      <p className="label">Partners</p>
      <div className={styles.viewport}>
        <ul className={styles.track}>
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </div>
  )
}
