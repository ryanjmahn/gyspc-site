import { stripe } from '../content/site'

/** Thin multi-colour bar in the global palette. Decorative. */
export function Stripe({ className }: { className?: string }) {
  return (
    <div className={['stripe', className].filter(Boolean).join(' ')} aria-hidden="true">
      {stripe.map((a, i) => (
        <span key={i} style={{ background: `var(--c-${a})` }} />
      ))}
    </div>
  )
}
