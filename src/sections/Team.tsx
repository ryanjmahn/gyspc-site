import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { executives, executivesRolesLabel, isTBA, sections, type Executive } from '../content/site'
import styles from './Team.module.css'

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join('')

function Portrait({ person }: { person: Executive }) {
  if (!isTBA(person.photo)) {
    return (
      <img
        className={styles.photo}
        src={person.photo}
        alt={`Portrait of ${person.name}`}
        loading="lazy"
        width={480}
        height={480}
      />
    )
  }
  return (
    <div
      className={styles.placeholder}
      role="img"
      aria-label={`Photo of ${person.name} to be added`}
    >
      <span className={styles.initials} aria-hidden="true">
        {initials(person.name)}
      </span>
      <span className={styles.photoTba} aria-hidden="true">
        Photo · TBA
      </span>
    </div>
  )
}

function Person({ person, index }: { person: Executive; index: number }) {
  const org = person.affiliation.startsWith('STEMise') ? styles.stemise : styles.ies
  return (
    <Reveal as="li" index={index} className={styles.person}>
      <Portrait person={person} />
      <div className={styles.caption}>
        <h4 className={styles.name}>{person.name}</h4>
        <p className={styles.position}>{person.position}</p>
        <p className={`${styles.org} ${org}`}>{person.affiliation}</p>
        <p className={styles.rolesLabel}>{executivesRolesLabel}</p>
        <ul className={styles.roles}>
          {person.roles.map((r) => (
            <li key={r.en}>
              <span className={styles.roleEn}>{r.en}</span>
              {r.ko ? (
                <span className={styles.roleKo} lang="ko">
                  {r.ko}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

/** §08 — the executive committee as a masthead: directors large, the team beneath. */
export function Team() {
  const { id, index, title, accent, symbol } = sections.team
  return (
    <section id={id} className={`section accent-${accent}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader index={index} title={title} id={`${id}-title`} symbol={symbol} />
        {executives.map((group, gi) => (
          <div key={group.heading} className={styles.group}>
            <h3 className={styles.groupHead}>
              {group.heading}
              {group.headingKo ? (
                <span className={styles.groupKo} lang="ko">
                  {group.headingKo}
                </span>
              ) : null}
            </h3>
            <ul className={`${styles.people} ${gi === 0 ? styles.lead : styles.rest}`}>
              {group.people.map((p, i) => (
                <Person key={p.name} person={p} index={i} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
