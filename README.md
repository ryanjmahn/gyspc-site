# GYSPC — Global Youth Science & Policy Competition

The official site for GYSPC, hosted by **IES (Interscholastic Ethics Society) × STEMise**.
It's a single long page built with Vite, React and TypeScript.

https://gyspc-site-finder.lovable.app

## Run it

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build → dist/ (prerendered HTML)
npm run preview    # serve dist/ at http://localhost:4173
npm run lint       # ESLint
npm run format     # Prettier
```

---

## Editing content (no coding needed)

**Every word and date on the site lives in one file: [`src/content/site.ts`](src/content/site.ts).**
Open it in any text editor, change the text between the quotes, save, and redeploy.

### Anything that says `TBA`

`TBA` means "not announced yet". The site shows it as a styled `[ TBA ]` placeholder.
To publish the real value, replace `TBA` with text in quotes:

```ts
// before
{ label: 'Team size', value: TBA },
// after
{ label: 'Team size', value: '1–3 students' },
```

Empty lists work the same way. `prizes: []` shows `[ TBA ]` until you add an item:

```ts
export const prizes: Prize[] = [{ title: 'Track winner', description: 'One per track.' }]
```

### Changing a date on the timeline

Find the milestone in `timeline` and edit its three date fields:

```ts
{
  id: 'reg-open',
  label: 'Registration opens',
  date: 'October 2026',     // what visitors read
  shortDate: 'Oct 2026',    // compact form (hero data line)
  startsOn: '2026-10-01',   // first day it applies (YYYY-MM-DD)
  endsOn: '2026-10-31',     // last day it applies  (YYYY-MM-DD)
},
```

The site works out each milestone's status from today's date. Past milestones get struck through, and the next one gets a red circle. You never set that by hand.

For the **submission deadline** (currently `date: TBA`), set `date` and add `startsOn` / `endsOn`.
For the **exact finals date**, change `detail: { label: 'exact date', value: TBA }` to the date.

### Opening registration

Set `registration.url` to the form link. The Register buttons become live links automatically.

```ts
export const registration = {
  url: 'https://forms.example.org/gyspc',
  ...
}
```

Set `contact.email`, and add `contact.socials` entries (`{ label: 'Instagram', href: '…' }`) the same way.

### Judges

`judging.judges` starts empty, and the Judges block stays hidden until you add at least one entry:
`{ name: '…', affiliation: '…' }`.

### Other things you can edit in `site.ts`

- **Section colours and symbols:** each entry in `sections` has an `accent` (colour) and a `symbol`.
  The symbol is drawn at the end of the header rule. Available symbols: scales, ballot, gavel, document, cycle, pillar,
  partnership, megaphone, flask, chart, globe, question.
- **UN SDG links per track:** `sdgs: [4, 9, 16]` on each track. Goal names and official colours are in `sdgs`.
  The footnote (`sdgNote`) says the links are thematic and that GYSPC isn't affiliated with the UN. Keep it.
- **The four-step strip in the Premise:** `premise.process`.
- **Countdown wording** beside the timeline: `countdown`.

---

## Adding executive photos

1. Put each headshot in `public/team/`, e.g. `public/team/ryan-ahn.webp`. Square images around 480×480 work best.
2. In `site.ts` → `executives`, set that person's `photo: '/team/ryan-ahn.webp'`.

The current photos come from the IES Global Foundation leadership page and stemise.org/about.

Until a photo is set, a placeholder shows the person's initials. To add or reorder people or roles, edit the same list.
Each person has a `position` and `affiliation` (their title at their home organisation), plus `roles` (their GYSPC roles).
Each role takes an English title and an optional Korean one (`ko`).

---

## Swapping in logos

1. Put the logo files in `public/logos/`. The IES seal is already there (`public/logos/ies.webp`, from ie-society.com).
2. In `site.ts`, set each host's `logo` to the file's path, e.g. `logo: '/logos/stemise.svg'`.

The logo shows beside the host's name (STEMise's mark is `public/logos/stemise.webp`, from stemise.org). Without a logo, the name shows on its own.

**Partner logo belt:** add entries to `partnerLogos` (`{ name, src, href? }`). The scrolling belt in the Hosts section appears only once the list has at least one logo. It pauses on hover and doesn't move for visitors who prefer reduced motion.

---

## Deploying

**Vercel (recommended):** import the repo and pick the "Vite" framework preset.
The build command is `npm run build` and the output directory is `dist`. No other settings are needed.

**GitHub Pages:** add `base: '/<repo-name>/'` to `vite.config.ts`. Then change the absolute
`/fonts/…`, `/favicon.svg`, `/og-image.png` paths in `index.html` and `src/styles/fonts.css` to include that base.

**After you have a domain:** social previews need an absolute image URL. In `index.html`, change
`<meta property="og:image" content="/og-image.png" />` to `https://your-domain/og-image.png`.

### Regenerating the social image and icon

`public/og-image.png` (1200×630) and `public/apple-touch-icon.png` are rendered from the hero headline in `site.ts`.
If you change the headline, run:

```bash
node scripts/og-image.mjs
```

### Globe data

The hero globe's land dots come from Natural Earth (public domain) and are precomputed into
`src/illustrations/landDots.ts` by `node scripts/globe-data.mjs`. You won't need to re-run it.

### Screenshots

With `npm run preview` running, `node scripts/screenshots.mjs` saves full-page captures at
375 / 768 / 1440 px to `docs/screenshots/`.

---

## How the site is put together

```
src/
  content/site.ts        all copy + types (the only file to edit for content)
  styles/tokens.css      colours, type scale, spacing, motion
  styles/fonts.css       self-hosted fonts (public/fonts)
  styles/global.css      base styles, manuscript grid
  components/            Nav, Footer, SectionHeader, MarginNote, Redline, TBA, Button, LogoBelt, …
  sections/              Hero, Premise, Tracks, Format, Timeline, Eligibility, Judging, Hosts, FAQ, ClosingCTA
  illustrations/         one SVG per track + landDots.ts (generated globe data)
  hooks/                 useReducedMotion, useInViewOnce
  entry-server.tsx       build-time prerender entry
scripts/                 prerender, OG image, screenshots
docs/reference-notes.md  stemise.org reference study
```

**The design concept is "The Annotated Page":** a scientific document being marked up by a policymaker.
The palette is STEM × UN: white pages, navy ink, and a set of UN SDG-inspired accent colours. The fonts and editing marks all have fixed jobs. Keep these rules when you add anything:

| Element                                                                       | Means                                                  | Used for                                                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Fraunces** (serif, italic)                                                  | the humanities voice                                   | headlines, pull quotes, margin notes, track names                                          |
| **JetBrains Mono**                                                            | the science voice                                      | dates, labels, section numbers, figure captions                                            |
| **IBM Plex Sans**                                                             | body text                                              | paragraphs, buttons                                                                        |
| `--c-*` / `--t-*` accents (blue, green, amber, magenta, teal, orange, purple) | each section's and each track's colour                 | section numbers, track numbers, band tints, the multi-colour stripe, the crowd             |
| `--mark` (= the section's accent)                                             | a policy decision / intervention (the editor's pencil) | strikes, circles, carets, the policy layer of each track illustration, the Register button |
| `--ies` / `--ies-accent`, `--stemise`                                         | host brands only                                       | host names, logos, links                                                                   |

Section and track colours are set with `accent:` in `site.ts`.
| `--stemise` blue | STEMise-attributed only | STEMise wordmark and links |

**Spacing:** every section uses two tokens from `tokens.css`. `--section-pad` is the space above and below a section
(80 px on phones, rising to 128 px on desktop). `--section-gap` is the space between blocks inside a section (40 → 64 px).
Change them there and the whole page stays in step.

**Motion and interactivity:**

- The globe turns on its own. Drag it, or focus it and use ←/→, to spin it. Hovering a track in the legend highlights that track's satellite.
- The dither fields (top of Tracks, behind the closing line) are interfering waves in ordered dither. Particles drift through them and scatter away from the pointer.
- Sections fade up as they scroll in. Track illustrations and editing marks draw themselves once.
- The countdown counts up. The crowd rises into place, and figures step up on hover.
- A progress bar under the nav stripe shows how far down the page you are.

Visitors with _reduce motion_ turned on see every final state immediately, and nothing moves on its own.

**Performance notes:**

- Fonts are subset to the characters the site uses (Fraunces is also trimmed to weights 400–600).
- The globe's map data loads after the page is interactive.
- Decorative SVGs below the fold render on the client instead of in the HTML.
- The main script loads at low priority, because the prerendered page is readable before it runs.
