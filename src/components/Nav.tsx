import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { identity, nav, sections, type SectionId } from '../content/site'
import { RegisterButton } from './RegisterButton'
import { ScrollProgress } from './ScrollProgress'
import { Stripe } from './Stripe'
import styles from './Nav.module.css'

/** Scroll spy: the nav target whose section currently crosses the middle of the viewport. */
function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId | null>(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    // Clear the indicator above the first tracked section.
    const onScroll = () => {
      if (els[0] && els[0].getBoundingClientRect().top > window.innerHeight * 0.5) setActive(null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])
  return active
}

const navIds = nav.map((n) => n.section)

/** Position of the red active-link underline, measured from the active link. */
function useIndicator(listRef: React.RefObject<HTMLUListElement | null>, active: SectionId | null) {
  const [box, setBox] = useState<{ x: number; w: number } | null>(null)
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const link = active ? list.querySelector<HTMLElement>(`a[href="#${active}"]`) : null
      setBox(link ? { x: link.offsetLeft, w: link.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [listRef, active])
  return box
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(navIds)
  const listRef = useRef<HTMLUListElement>(null)
  const indicator = useIndicator(listRef, active)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: lock page scroll, focus the first link, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return
    const toggle = toggleRef.current
    const menu = menuRef.current
    document.body.style.overflow = 'hidden'
    menu?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab' || !menu) return
      const focusables = [
        toggle,
        ...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ].filter((el): el is HTMLElement => !!el)
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      toggle?.focus()
    }
  }, [open])

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <Stripe />
        <ScrollProgress />
        <div className={`container ${styles.bar}`}>
          <a
            href="#top"
            className={styles.wordmark}
            aria-label={`${identity.shortName} — back to top`}
          >
            {identity.shortName}
          </a>

          <nav aria-label="Primary" className={styles.desktop}>
            <ul ref={listRef} className={styles.links}>
              {nav.map((item) => (
                <li key={item.section}>
                  <a
                    href={`#${item.section}`}
                    className={styles.link}
                    aria-current={active === item.section ? 'location' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li
                aria-hidden="true"
                className={styles.indicator}
                style={
                  indicator
                    ? { transform: `translateX(${indicator.x}px)`, width: indicator.w, opacity: 1 }
                    : { opacity: 0 }
                }
              />
            </ul>
          </nav>

          <div className={styles.actions}>
            <RegisterButton className={styles.cta} />
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className={styles.menu}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <nav aria-label="Primary (mobile)" className="container">
            <ol className={styles.menuLinks}>
              {nav.map((item) => (
                <li key={item.section}>
                  <a href={`#${item.section}`} onClick={() => setOpen(false)}>
                    <span className={styles.menuIndex}>
                      {item.section === 'top' ? '§00' : `§${sections[item.section].index}`}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
            <div className={styles.menuCta}>
              <RegisterButton />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
