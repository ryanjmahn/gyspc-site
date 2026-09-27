import type { SVGProps } from 'react'
import type { SymbolName } from '../content/site'

/**
 * Line symbols for policy and change, drawn on a 24px grid with 1.5px strokes to match the
 * illustrations. Colour follows `currentColor`.
 */
const SYMBOLS = {
  /** Justice, weighing evidence. */
  scales:
    'M12 3.5v16.5M8 20h8M4.5 7h15M12 3.5l-1.2 3.5h2.4zM4.5 7L2 13h5zM19.5 7L17 13h5zM2 13a2.5 2 0 0 0 5 0M17 13a2.5 2 0 0 0 5 0',
  /** A vote, a decision taken. */
  ballot: 'M3.5 13h17v7h-17zM7 13V4h10v9M9.5 8.5l1.8 1.8 3.5-3.6M2.5 13h19',
  /** A ruling. */
  gavel: 'M12.3 3.2l7.8 7.8-2.6 2.6-7.8-7.8zM13.8 9.6L5 18.4M3 21h9',
  /** A written proposal / bill. */
  document: 'M6 3h9l4 4v14H6zM15 3v4h4M9 11h7M9 14h7M9 17h4',
  /** Change: a cycle that turns. */
  cycle: 'M19.5 12a7.5 7.5 0 0 1-13 5.1M4.5 12a7.5 7.5 0 0 1 13-5.1M17.8 3.2v3.8H14M6.2 20.8V17H10',
  /** Institutions. */
  pillar: 'M3 9l9-5 9 5M3 9h18M5.5 9v9M9.8 9v9M14.2 9v9M18.5 9v9M3 18h18M2 21h20',
  /** Partnership: two bodies overlapping. */
  partnership: 'M14 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0M20 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0',
  /** Voice, advocacy. */
  megaphone: 'M3 10v4h3l8 5V5l-8 5zM17.5 9a4 4 0 0 1 0 6M20.5 6.5a7.5 7.5 0 0 1 0 11',
  /** Science: the lab flask. */
  flask: 'M9 3h6M10 3v6l-5.2 9.2A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.8L14 9V3M7.2 15h9.6',
  /** Evidence: a rising chart. */
  chart: 'M4 3.5V20h16.5M8 15.5l3.5-4.5 3 2.5 5-6.5',
  /** The world. */
  globe:
    'M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18',
  /** A question under deliberation. */
  question: 'M4 5h16v11H11l-5 4v-4H4zM9.8 8.8a2.2 2.2 0 1 1 3 2c-.6.3-.8.7-.8 1.2M12 14h.01',
} as const satisfies Record<SymbolName, string>

export function PolicySymbol({
  name,
  size = 24,
  title,
  ...rest
}: { name: SymbolName; size?: number; title?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path d={SYMBOLS[name]} />
    </svg>
  )
}
