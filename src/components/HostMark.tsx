import { isTBA, type Host } from '../content/site'
import styles from './HostMark.module.css'

/** A host's name set in that host's voice, with its logo beside it once a logo file is supplied. */
export function HostMark({ host, size = 'sm' }: { host: Host; size?: 'sm' | 'lg' }) {
  return (
    <span className={[styles.mark, styles[host.id], styles[size]].join(' ')}>
      {!isTBA(host.logo) ? (
        <img className={styles.logo} src={host.logo} alt="" width={128} height={128} />
      ) : null}
      <span>{size === 'lg' ? host.name : host.shortName}</span>
    </span>
  )
}
