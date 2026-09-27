/**
 * GYSPC — all site copy and event facts live in this file.
 *
 * Editing guide (see README.md for more):
 *   - Anything not yet decided is the value `TBA`. Replace `TBA` with the real text to publish it.
 *   - Lists that are still empty (e.g. `prizes: []`) render a styled "TBA" until you add items.
 *   - Timeline dates: `date` is what visitors read; `startsOn` / `endsOn` (YYYY-MM-DD) are what the
 *     site uses to work out which milestone is past, current or upcoming.
 *
 * Components never hard-code event facts — if it's on the page, it comes from here.
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export const TBA = 'TBA' as const
export type TBA = typeof TBA
/** A value that may not be announced yet. */
export type Maybe<T> = T | TBA

export const isTBA = (v: unknown): v is TBA => v === TBA

export type Link = { label: string; href: string }

export type Host = {
  id: 'ies' | 'stemise'
  name: string
  shortName: string
  /** Which of the site's two voices this host carries. */
  voice: 'humanities' | 'science'
  role: string
  description: Maybe<string>
  url: Maybe<string>
  /** Path under /public, e.g. '/logos/stemise.svg'. TBA → a text wordmark is shown instead. */
  logo: Maybe<string>
}

export type IllustrationId = 'ai' | 'bio' | 'climate' | 'society'

/** Colours from the global palette (tokens.css). Each section and track gets one. */
export type Accent = 'blue' | 'orange' | 'green' | 'teal' | 'magenta' | 'purple' | 'amber'

export type Track = {
  id: string
  name: string
  topics: string[]
  /** Draft framing question, shown in serif italic. */
  question: string
  accent: Accent
  /** UN Sustainable Development Goals this track speaks to (numbers; see `sdgs`). */
  sdgs: number[]
  illustration: IllustrationId
  /** Screen-reader description of the track illustration. */
  illustrationLabel: string
}

export type MilestoneStatus = 'past' | 'current' | 'upcoming'

export type MilestoneInput = {
  id: string
  label: string
  /** What visitors read, e.g. 'October 2026'. */
  date: Maybe<string>
  /** Short form for compact places (hero data line). */
  shortDate?: string
  /** Extra precision still to come, e.g. the exact finals date. */
  detail?: { label: string; value: Maybe<string> }
  /** First day this milestone applies (YYYY-MM-DD). Omit if TBA. */
  startsOn?: string
  /** Last day this milestone applies (YYYY-MM-DD). Omit if TBA. */
  endsOn?: string
}

export type Milestone = MilestoneInput & { status: MilestoneStatus }

export type FormatStage = {
  id: string
  stage: string
  name: string
  mode: string
  facts: { label: string; value: Maybe<string> }[]
}

export type Fact = { label: string; value: Maybe<string> }

export type FAQItem = { question: string; answer: Maybe<string> }

export type Judge = { name: string; affiliation: string }

export type Executive = {
  name: string
  /** Position at their home organisation, e.g. 'Founder & Executive Director'. */
  position: string
  /** Home organisation. Starts with "IES" or "STEMise" to pick up that host's colour. */
  affiliation: string
  /** Their roles on the GYSPC committee (English + optional Korean). */
  roles: { en: string; ko?: string }[]
  /** Path under /public, e.g. '/team/ryan-ahn.webp' (square headshot). TBA → placeholder. */
  photo: Maybe<string>
}
export type Prize = { title: string; description: string }

export type SectionId =
  | 'top'
  | 'premise'
  | 'tracks'
  | 'format'
  | 'timeline'
  | 'eligibility'
  | 'judging'
  | 'hosts'
  | 'team'
  | 'faq'
  | 'register'

/** Names from components/PolicySymbol.tsx. */
export type SymbolName =
  | 'scales'
  | 'ballot'
  | 'gavel'
  | 'document'
  | 'cycle'
  | 'pillar'
  | 'partnership'
  | 'megaphone'
  | 'flask'
  | 'chart'
  | 'globe'
  | 'question'

export type SectionMeta = {
  id: SectionId
  index: string
  title: string
  accent: Accent
  /** Symbol at the end of the section header rule. */
  symbol: SymbolName
}

/* ------------------------------------------------------------------ */
/* Identity                                                           */
/* ------------------------------------------------------------------ */

export const identity = {
  name: 'Global Youth Science & Policy Competition',
  shortName: 'GYSPC',
  premise:
    'Science tells us what we can do. Policy decides what we should. GYSPC asks students to do both.',
  cycle: '2026–27',
}

export const hosts: Host[] = [
  {
    id: 'stemise',
    name: 'STEMise',
    shortName: 'STEMise',
    voice: 'science',
    role: 'Co-host · the STEM voice',
    description:
      'An international youth-led nonprofit running free global STEM competitions and hackathons, and supporting student-led chapters in their own communities.',
    url: 'https://www.stemise.org',
    logo: '/logos/stemise.webp',
  },
  {
    id: 'ies',
    name: 'Interscholastic Ethics Society',
    shortName: 'IES',
    voice: 'humanities',
    role: 'Co-host · the ethics & policy voice',
    description:
      'A student-led organization dedicated to ethical discourse and civic engagement — founded in Korea in 2023, it turns dialogue into service through ethics forums, debate, policy advocacy and community service.',
    url: 'https://ie-society.com',
    logo: '/logos/ies.webp',
  },
]

/** Scrolling partner-logo belt. Stays hidden until at least one logo is added. */
export const partnerLogos: { name: string; src: string; href?: string }[] = []

/* ------------------------------------------------------------------ */
/* Sections & navigation                                              */
/* ------------------------------------------------------------------ */

export const sections: Record<Exclude<SectionId, 'top'>, SectionMeta> = {
  premise: { id: 'premise', index: '01', title: 'The Premise', accent: 'blue', symbol: 'scales' },
  tracks: { id: 'tracks', index: '02', title: 'Tracks', accent: 'purple', symbol: 'flask' },
  format: { id: 'format', index: '03', title: 'Format', accent: 'amber', symbol: 'globe' },
  timeline: { id: 'timeline', index: '04', title: 'Timeline', accent: 'magenta', symbol: 'cycle' },
  eligibility: {
    id: 'eligibility',
    index: '05',
    title: 'Who Can Enter',
    accent: 'orange',
    symbol: 'document',
  },
  judging: {
    id: 'judging',
    index: '06',
    title: 'Judging & Prizes',
    accent: 'green',
    symbol: 'gavel',
  },
  hosts: { id: 'hosts', index: '07', title: 'Hosts', accent: 'blue', symbol: 'partnership' },
  team: { id: 'team', index: '08', title: 'Executives', accent: 'purple', symbol: 'pillar' },
  faq: { id: 'faq', index: '09', title: 'Questions', accent: 'teal', symbol: 'question' },
  register: { id: 'register', index: '10', title: 'Register', accent: 'blue', symbol: 'ballot' },
}

export const nav: { label: string; section: SectionId }[] = [
  { label: 'Tracks', section: 'tracks' },
  { label: 'Format', section: 'format' },
  { label: 'Timeline', section: 'timeline' },
  { label: 'Hosts', section: 'hosts' },
  { label: 'Team', section: 'team' },
  { label: 'FAQ', section: 'faq' },
]

/* ------------------------------------------------------------------ */
/* Registration & contact                                             */
/* ------------------------------------------------------------------ */

export const registration = {
  url: TBA as Maybe<string>,
  /** Shown on the Register button while `url` is TBA. */
  closedNote: 'Registration opens October 2026',
}

export const contact = {
  email: TBA as Maybe<string>,
  socials: [] as Link[],
}

/* ------------------------------------------------------------------ */
/* §00 Hero                                                           */
/* ------------------------------------------------------------------ */

/** Order of the multi-colour stripe (nav top, closing band). */
export const stripe: Accent[] = ['blue', 'green', 'amber', 'magenta', 'teal', 'orange', 'purple']

export const hero = {
  /** The headline is shown as an edit in progress: lead, struck phrase, inserted phrase. */
  headline: {
    lead: 'Science asks',
    struck: 'what we can do',
    inserted: 'what we should do.',
  },
  lede: `The ${identity.name} is a global contest for students who can research a scientific question and argue what society should do about it.`,
  marginNote: 'Every technology is also a policy question.',
  globeLabel:
    'A slowly turning globe drawn in dots, circled by an orbit carrying the four competition tracks.',
  issuesLabel: 'On the table',
  globeHint: 'Drag to turn the globe',
  secondaryCta: { label: 'Read the tracks', section: 'tracks' as SectionId },
}

/* ------------------------------------------------------------------ */
/* §01 Premise                                                        */
/* ------------------------------------------------------------------ */

export const premise = {
  manifesto: [
    'Most competitions ask you to pick a side: the lab or the debate hall.',
    'GYSPC asks for both. Entrants research a real scientific or technological issue, then propose a policy response to it.',
    'Both halves are judged — the rigour of the evidence and the judgement of the proposal.',
  ],
  pullQuote: identity.premise,
  /** The two halves of an entry, as a process. */
  process: [
    { symbol: 'chart', label: 'Evidence', text: 'Research the science or technology.' },
    { symbol: 'scales', label: 'Deliberation', text: 'Weigh who gains and who bears the risk.' },
    { symbol: 'document', label: 'Proposal', text: 'Write a policy response.' },
    { symbol: 'cycle', label: 'Change', text: 'Argue for what should happen next.' },
  ] satisfies { symbol: SymbolName; label: string; text: string }[],
}

/* ------------------------------------------------------------------ */
/* §02 Tracks                                                         */
/* ------------------------------------------------------------------ */

export const tracks: Track[] = [
  {
    id: 'ai-digital-society',
    name: 'AI & Digital Society',
    accent: 'purple',
    sdgs: [4, 9, 16],
    topics: ['deepfakes', 'AI in education', 'algorithmic bias', 'youth AI protections'],
    question: 'When a machine can fake a face, who is responsible for the truth?',
    illustration: 'ai',
    illustrationLabel:
      'A face drawn as a halftone dot grid labelled “source: unverified”. A red bracket marks half of the face, with the handwritten note “consent?”.',
  },
  {
    id: 'bioethics-health',
    name: 'Bioethics & Health',
    accent: 'green',
    sdgs: [3, 10],
    topics: ['genetic engineering', 'neurotechnology', 'health-data privacy'],
    question: 'If we can edit life, who gets to write the rules?',
    illustration: 'bio',
    illustrationLabel:
      'A DNA sequence written out as lines of text. One codon is struck through in red and a replacement is inserted above it, like an editor correcting a sentence.',
  },
  {
    id: 'climate-environmental-technology',
    name: 'Climate & Environmental Technology',
    accent: 'teal',
    sdgs: [7, 13],
    topics: ['geoengineering', 'carbon removal', 'climate adaptation'],
    question: 'Who consents to engineering the sky?',
    illustration: 'climate',
    illustrationLabel:
      'A line chart with a rising curve on a faint grid. A red intervention line branches off and bends the curve downward, annotated “at whose risk?”.',
  },
  {
    id: 'future-society',
    name: 'Future Society',
    accent: 'orange',
    sdgs: [8, 10, 11],
    topics: ['automation', 'inequality', 'smart cities', 'surveillance'],
    question: 'Who is the smart city smart for?',
    illustration: 'society',
    illustrationLabel:
      'A top-down street grid with small dots for people. Red dashed sightlines fan out from camera points, and one city block is circled in red.',
  },
]

/** Caption over the dither band at the top of the Tracks section. */
export const signalCaption = 'Signal → decision'

export const tracksFootnote = 'One winner is selected per track.'

/** UN Sustainable Development Goals referenced by the tracks — official names and colours. */
export const sdgs: Record<number, { name: string; color: string; darkText?: boolean }> = {
  3: { name: 'Good Health and Well-being', color: '#4C9F38' },
  4: { name: 'Quality Education', color: '#C5192D' },
  7: { name: 'Affordable and Clean Energy', color: '#FCC30B', darkText: true },
  8: { name: 'Decent Work and Economic Growth', color: '#A21942' },
  9: { name: 'Industry, Innovation and Infrastructure', color: '#FD6925', darkText: true },
  10: { name: 'Reduced Inequalities', color: '#DD1367' },
  11: { name: 'Sustainable Cities and Communities', color: '#FD9D24', darkText: true },
  13: { name: 'Climate Action', color: '#3F7E44' },
  16: { name: 'Peace, Justice and Strong Institutions', color: '#00689D' },
}

export const sdgLabel = 'Related UN SDGs'
export const sdgNote =
  'SDG links are thematic. GYSPC is an independent student competition, not affiliated with the United Nations.'

/* ------------------------------------------------------------------ */
/* §03 Format                                                         */
/* ------------------------------------------------------------------ */

export const format = {
  figureCaption: 'Competition format',
  stages: [
    {
      id: 'prelim',
      stage: 'Stage 1',
      name: 'Online Preliminary',
      mode: 'Online',
      facts: [
        { label: 'Where', value: 'Online' },
        { label: 'What happens', value: TBA },
        { label: 'Who advances', value: TBA },
      ],
    },
    {
      id: 'final',
      stage: 'Stage 2',
      name: 'In-person Final',
      mode: 'In person',
      facts: [
        { label: 'Where', value: 'In person (offsite)' },
        { label: 'Venue', value: TBA },
        { label: 'When', value: 'February 2027' },
      ],
    },
  ] satisfies FormatStage[],
}

/* ------------------------------------------------------------------ */
/* §04 Timeline                                                       */
/* ------------------------------------------------------------------ */

/** Live countdown shown beside the timeline. {label} and {n} are filled in automatically. */
export const countdown = {
  before: '{label} in',
  during: '{label} — now',
  unit: ['day', 'days'] as const,
}

export const timelineKey =
  'Struck through: behind us. Circled: what comes next. Unmarked: still ahead.'

export const timeline: MilestoneInput[] = [
  {
    id: 'reg-open',
    label: 'Registration opens',
    date: 'October 2026',
    shortDate: 'Oct 2026',
    startsOn: '2026-10-01',
    endsOn: '2026-10-31',
  },
  {
    id: 'reg-close',
    label: 'Registration closes',
    date: 'December 2026',
    shortDate: 'Dec 2026',
    startsOn: '2026-12-01',
    endsOn: '2026-12-31',
  },
  {
    id: 'submission',
    label: 'Submission deadline',
    date: TBA,
  },
  {
    id: 'judging',
    label: 'Judging period',
    date: 'Late December 2026 – late January 2027',
    startsOn: '2026-12-20',
    endsOn: '2027-01-31',
  },
  {
    id: 'finals',
    label: 'Finals day',
    date: 'February 2027',
    shortDate: 'Feb 2027',
    detail: { label: 'exact date', value: TBA },
    startsOn: '2027-02-01',
    endsOn: '2027-02-28',
  },
]

/* ------------------------------------------------------------------ */
/* §05 Eligibility & submission                                       */
/* ------------------------------------------------------------------ */

export const eligibility = {
  heading: 'Eligibility',
  facts: [
    { label: 'Age / grade', value: TBA },
    { label: 'Team size', value: TBA },
  ] satisfies Fact[],
}

export const submission = {
  heading: 'What you submit',
  facts: [
    { label: 'Format', value: TBA },
    { label: 'Length', value: TBA },
    { label: 'Deadline', value: TBA },
  ] satisfies Fact[],
}

export const rulesNote = 'Full rules will be published when registration opens.'

/* ------------------------------------------------------------------ */
/* §06 Judging & prizes                                               */
/* ------------------------------------------------------------------ */

export const judging = {
  note: 'Both halves are scored: the science and the policy.',
  /** e.g. ['Scientific accuracy', 'Feasibility of the policy'] — empty list shows TBA. */
  criteria: [] as string[],
  /** Judges block stays hidden until at least one judge is listed. */
  judges: [] as Judge[],
}

/** Empty list shows TBA. */
export const prizes: Prize[] = []

/* ------------------------------------------------------------------ */
/* §08 Executives                                                     */
/* ------------------------------------------------------------------ */

/**
 * To add a photo: put the image in public/team/ and set `photo: '/team/<file>.webp'`.
 * Square headshots (around 480×480) work best.
 */
export const executivesRolesLabel = 'GYSPC'

export const executives: { heading: string; headingKo?: string; people: Executive[] }[] = [
  {
    heading: 'Competition Directors',
    headingKo: '대회 공동운영위원장',
    people: [
      {
        name: 'Ryan Ahn',
        position: 'Founder & Executive Director',
        affiliation: 'STEMise',
        roles: [
          { en: 'Competition Director', ko: '대회 공동운영위원장' },
          { en: 'Tech Department' },
        ],
        photo: '/team/ryan-ahn.webp',
      },
      {
        name: 'Joseph Kang',
        position: 'Vice Chairman',
        affiliation: 'IES Global Foundation',
        roles: [{ en: 'Competition Director', ko: '대회 공동운영위원장' }],
        photo: '/team/joseph-kang.webp',
      },
    ],
  },
  {
    heading: 'Executive Team',
    people: [
      {
        name: 'Sean Jiho Han',
        position: 'President',
        affiliation: 'IES Global Foundation',
        roles: [{ en: 'Deputy Executive Director', ko: '부운영위원장' }],
        photo: '/team/sean-han.webp',
      },
      {
        name: 'Ryan Cha',
        position: 'President',
        affiliation: 'IES Korea',
        roles: [{ en: 'Logistics Department', ko: '운영기획본부장' }],
        photo: '/team/ryan-cha.webp',
      },
      {
        name: 'Jaehoo Lee',
        position: 'Business Analyst',
        affiliation: 'IES Global Foundation',
        roles: [{ en: 'Public Relations Department', ko: '대외협력홍보본부장' }],
        photo: '/team/jaehoo-lee.webp',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* §09 FAQ                                                            */
/* ------------------------------------------------------------------ */

export const faq: FAQItem[] = [
  { question: 'Who can participate?', answer: TBA },
  { question: 'Can I enter as a team?', answer: TBA },
  { question: 'Is there a fee?', answer: TBA },
  { question: 'What do I need to submit?', answer: TBA },
  { question: 'Where is the final held?', answer: TBA },
  { question: 'Can I enter more than one track?', answer: TBA },
]

/* ------------------------------------------------------------------ */
/* §10 Closing band & footer                                          */
/* ------------------------------------------------------------------ */

export const closing = {
  line: 'The future needs people who can read both the data and the room.',
  crowdLabel: 'A crowd of people of many heights, in every colour of the palette.',
}

export const footer = {
  columns: {
    competition: { heading: 'Competition', sections: ['tracks', 'timeline', 'faq'] as SectionId[] },
    hosts: { heading: 'Hosts' },
    contact: { heading: 'Contact' },
  },
  copyrightYear: 2026,
}

/* ------------------------------------------------------------------ */
/* SEO                                                                */
/* ------------------------------------------------------------------ */

export const seo = {
  title: 'GYSPC — Global Youth Science & Policy Competition',
  description:
    'A global student competition hosted by IES (Interscholastic Ethics Society) × STEMise. Tracks: AI & Digital Society, Bioethics, Climate Tech, Future Society.',
}

/* ------------------------------------------------------------------ */
/* Derived values (no need to edit below)                             */
/* ------------------------------------------------------------------ */

/**
 * Works out each milestone's status for a given day.
 * A milestone is past once its end date is behind us; one without dates (TBA) counts as past only
 * when a later milestone already is. The first milestone that isn't past is "current".
 */
export function withStatus(items: MilestoneInput[], today: Date = new Date()): Milestone[] {
  const day = today.toISOString().slice(0, 10)
  const past = items.map((m) => (m.endsOn ? m.endsOn < day : false))
  for (let i = items.length - 2; i >= 0; i--) {
    if (!items[i].endsOn && past[i + 1]) past[i] = true
  }
  const currentIndex = past.indexOf(false)
  return items.map((m, i) => ({
    ...m,
    status: past[i] ? 'past' : i === currentIndex ? 'current' : 'upcoming',
  }))
}

const regOpen = timeline.find((m) => m.id === 'reg-open')

/** e.g. GLOBAL · HYBRID · 4 TRACKS · REGISTRATION OPENS OCT 2026 */
export const heroDataLine = [
  'Global',
  'Hybrid',
  `${tracks.length} tracks`,
  regOpen?.shortDate ? `Registration opens ${regOpen.shortDate}` : undefined,
]
  .filter(Boolean)
  .join(' · ')
  .toUpperCase()
