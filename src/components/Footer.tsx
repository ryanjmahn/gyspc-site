import { contact, footer, hosts, identity, isTBA, sections } from '../content/site'
import { HostMark } from './HostMark'
import { TBA } from './TBA'
import styles from './Footer.module.css'

export function Footer() {
  const { competition, hosts: hostsCol, contact: contactCol } = footer.columns
  const hostNames = hosts.map((h) => h.name).join(' × ')

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <p className={styles.wordmark}>{identity.shortName}</p>
          <p className={styles.name}>{identity.name}</p>
          <p className={styles.hosted}>
            <span className="label">Hosted by</span>
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
          </p>
        </div>

        <nav className={styles.col} aria-labelledby="f-competition">
          <h2 id="f-competition" className={styles.heading}>
            {competition.heading}
          </h2>
          <ul>
            {competition.sections.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{id === 'top' ? identity.shortName : sections[id].title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>{hostsCol.heading}</h2>
          <ul>
            {hosts.map((h) => (
              <li key={h.id} className={h.id === 'stemise' ? styles.stemise : undefined}>
                {isTBA(h.url) ? (
                  <span>{h.shortName}</span>
                ) : (
                  <a href={h.url} target="_blank" rel="noopener noreferrer">
                    {h.shortName}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>{contactCol.heading}</h2>
          <ul>
            <li>
              {isTBA(contact.email) ? (
                <>
                  Email <TBA />
                </>
              ) : (
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              )}
            </li>
            {contact.socials.length === 0 ? (
              <li>
                Socials <TBA />
              </li>
            ) : (
              contact.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {footer.copyrightYear} {identity.shortName} · Hosted by {hostNames}
        </p>
      </div>
    </footer>
  )
}
