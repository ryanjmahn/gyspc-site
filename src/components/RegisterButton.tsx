import { isTBA, registration } from '../content/site'
import { Button } from './Button'

/** The primary CTA. Live link once `registration.url` is set; otherwise inactive with a note. */
export function RegisterButton({ className }: { className?: string }) {
  if (isTBA(registration.url)) {
    return (
      <Button className={className} disabledNote={`${registration.closedNote} · link TBA`}>
        Register
      </Button>
    )
  }
  return (
    <Button className={className} href={registration.url}>
      Register
    </Button>
  )
}
