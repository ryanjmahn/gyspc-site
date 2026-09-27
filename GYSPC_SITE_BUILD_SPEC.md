# GYSPC Website — Build Spec for Claude Agent

**Global Youth Science & Policy Competition**
Hosted by **Interscholastic Ethics Society Global Foundation** × **STEMise**

You are building the official website for GYSPC. Work through the phases below **in order**. Each phase ends with an acceptance checklist — do not start the next phase until every box in the current one is true. Do not invent facts (prizes, judges, venues, dates, eligibility). Anything not given in Section 2 is a `TBA` placeholder pulled from one content file.

---

## 0. Ground rules (read before writing any code)

1. **Stack:** Vite + React + TypeScript. No plain HTML/JS. Styling with CSS Modules or vanilla-extract **or** Tailwind with a fully custom theme (no default Tailwind colors left in use). Framer Motion is allowed for scroll-linked animation; no other animation libraries.
2. **All copy lives in one file:** `src/content/site.ts`, fully typed. Components never hard-code event facts. Changing a date or adding a prize must be a one-line edit in that file.
3. **No invented content.** If a field is unknown, render `TBA` (styled, see §4.6) — never a plausible-sounding guess.
4. **Banned generic "AI-template" tells** — the build fails review if any appear:
   - gradient pill buttons; teal→purple or any gradient CTAs
   - dark navy + mint + lavender palette
   - emoji used as icons
   - badge-pill above a centered giant headline above a row of stat pills (the templated hero formula)
   - every section resolving to N identical rounded cards in a row
   - decorative filler line-art (random double-helix, squiggles) with no content purpose
   - default `particles.js` / `tsParticles` configs
   - Inter / system-ui as the headline face
5. **Accessibility is non-negotiable:** WCAG AA contrast, visible focus states, full keyboard nav, `prefers-reduced-motion` disables all scroll animation and shows final states.

---

## 1. Reference: stemise.org (thematic inspiration, not a clone)

Before designing, **open https://www.stemise.org in a browser and take screenshots** (desktop + mobile). Text-only fetching will miss the visual treatment. Record in `docs/reference-notes.md`:
- its actual palette (sample hex values), headline/body fonts, spacing rhythm, nav pattern, button style
- what to **borrow**: the confident short-imperative headline voice ("Don't study STEM. Build it."), the top nav with a Programs dropdown and a primary CTA on the right, the scrolling partner-logo belt, the concise "numbers we can point at" credibility block, the clean "Get involved" closing band, the footer column structure (Explore / Join / Community)
- what to **change**: GYSPC must feel like the *intersection of STEM and the humanities*, not a pure STEM/tech org. Keep one or two STEMise brand tokens (e.g. its accent color) so the family resemblance is visible — this is a STEMise-hosted event — then build the rest of the identity from §3.

---

## 2. Canonical content (source of truth for `src/content/site.ts`)

### Identity
- Name: **Global Youth Science & Policy Competition (GYSPC)**
- Hosts: **Interscholastic Ethics Society Global Foundation** and **STEMise** (co-equal billing; both logos in header-adjacent "Hosted by" line and footer)
- One-line premise (draft, may be edited): *Science tells us what we can do. Policy decides what we should. GYSPC asks students to do both.*

### Tracks — one winner per track
| Track | Topics |
|---|---|
| **AI & Digital Society** | deepfakes, AI in education, algorithmic bias, youth AI protections |
| **Bioethics & Health** | genetic engineering, neurotechnology, health-data privacy |
| **Climate & Environmental Technology** | geoengineering, carbon removal, climate adaptation |
| **Future Society** | automation, inequality, smart cities, surveillance |

### Format — hybrid
- **Preliminary round:** online
- **Final round:** in person (offsite) — venue `TBA`

### Timeline (2026–27 cycle)
| Milestone | When |
|---|---|
| Registration opens | October 2026 |
| Registration closes | December 2026 |
| Submission deadline | `TBA` |
| Judging period | Late December 2026 – late January 2027 |
| Finals day | February 2027 (exact date `TBA`) |

### Placeholders to include as typed fields (all `TBA` for now)
eligibility (age/grade), team size, submission format & length, judging criteria, prizes, judges, finals venue, registration URL, contact email, FAQ entries, social links.

---

## 3. Design concept: "The Annotated Page"

The core idea: **a scientific document being read and marked up by a policymaker.** Science is the body text; the humanities are the marginalia, the redlines, the footnotes. Every visual choice expresses that two-voice relationship.

### 3.1 Typography — two voices, fixed roles
| Role | Face (Google Fonts) | Used for |
|---|---|---|
| **Humanities voice** | a literary serif with a strong italic — *Fraunces*, *Newsreader*, or *Source Serif 4* | headlines, pull quotes, margin notes, track names |
| **Science voice** | a monospace — *IBM Plex Mono* or *JetBrains Mono* | data labels, dates, timeline stamps, figure captions, section indices (`§01`, `FIG. 2`) |
| **Body** | a neutral, highly legible sans — *IBM Plex Sans* or *Public Sans* | paragraphs, UI controls |

Pick one of each; document the choice. Never swap roles (e.g. mono is never a headline, serif italic is never a data label).

### 3.2 Palette — "paper, ink, redline"
Warm, editorial, light-dominant. Define as CSS custom properties with fixed roles:
- `--paper` warm off-white (≈ `#F6F3EC`) — page background
- `--paper-2` slightly darker (≈ `#ECE7DC`) — alternating section bands
- `--ink` near-black warm (≈ `#1C1B19`) — text, hairlines
- `--ink-soft` (≈ `#5E5A52`) — secondary text
- `--redline` editorial red (≈ `#B8321E`) — **policy/ethics intervention only**: strikethroughs, circled annotations, the active timeline marker, primary CTA. Under ~8% of any viewport. Never a gradient.
- `--stemise` one accent sampled from stemise.org — used **only** for STEMise-attributed elements (host credit, "a STEMise event" tags, link hover on STEMise items)

Dark mode: optional. If built, invert to deep warm charcoal with the same roles — do not introduce new hues.

### 3.3 Rendering techniques have fixed meanings
| Technique | Meaning | Where it appears |
|---|---|---|
| Monospace text, grid lines, plotted points | **science / data / evidence** | figure captions, timeline stamps, track "data plates" |
| Serif italic handwriting-style margin notes | **humanistic reflection / ethics** | margin notes beside sections, pull quotes |
| Red strikethrough, circles, arrows, inserted carets (`^`) | **policy decision / intervention** | hero headline edit, track illustrations, CTA emphasis |

Apply consistently. If a red mark appears somewhere, it must represent a judgment or change being made.

### 3.4 Layout rhythm
- Hairline rules (`1px var(--ink)` at ~20% opacity) instead of card boxes.
- A **two-column "manuscript" grid** on desktop: a wide main column + a narrow margin column for annotations (collapses to inline asides on mobile).
- Section headers numbered like a document: `§01 — The Premise`, `§02 — Tracks`, etc., in mono.
- Vary section layouts deliberately (see §5). No two consecutive sections share the same structure.
- Subtle paper texture: a very faint SVG noise overlay (≤ 3% opacity). No photographs of paper.

---

## 4. Phase 1 — Project scaffold & design tokens

1. `npm create vite@latest gyspc -- --template react-ts`; add ESLint + Prettier.
2. Folder structure:
   ```
   src/
     content/site.ts        # all copy + types
     styles/tokens.css      # colors, type scale, spacing, motion durations
     styles/global.css
     components/            # Nav, Footer, SectionHeader, MarginNote, Redline, TBA, Button, LogoBelt
     sections/              # Hero, Premise, Tracks, Format, Timeline, Eligibility, Judging, Prizes, FAQ, Hosts, CTA
     illustrations/         # one SVG component per track (Phase 3)
     hooks/useReducedMotion.ts
   docs/reference-notes.md
   ```
3. `tokens.css`: palette from §3.2, a modular type scale (≈1.25 ratio), 8px spacing scale, two motion durations (`--t-fast: 180ms`, `--t-slow: 600ms`), one easing curve.
4. Build shared primitives:
   - **`<SectionHeader index="01" title="The Premise" />`** — mono index + serif title + hairline rule
   - **`<MarginNote>`** — serif italic, `--ink-soft`, sits in margin column on desktop, inline indented aside on mobile
   - **`<Redline mode="strike|circle|underline|caret">`** — SVG overlay that draws itself (stroke-dashoffset) when scrolled into view; static when reduced-motion
   - **`<TBA label="Prizes" />`** — mono text `[ TBA ]` in `--ink-soft` with a dotted underline and a tooltip "Announced soon"
   - **`<Button variant="primary|ghost">`** — primary: solid `--redline` bg, paper text, square-ish (2–4px radius), no gradient; ghost: ink text + hairline border
6. Wire `site.ts` types: `Track`, `Milestone { label; date: string | 'TBA'; status: 'past'|'current'|'upcoming' }`, `Host`, `FAQItem`, etc.

**✅ Phase 1 acceptance**
- [ ] Fonts load; the three type roles render correctly on a test page
- [ ] No default Tailwind color classes in use (if Tailwind chosen)
- [ ] `site.ts` contains every fact from §2 and every placeholder field, typed
- [ ] `docs/reference-notes.md` exists with sampled stemise.org values

---

## 5. Phase 2 — Page structure (single long landing page)

Build sections in this order. Layout notes are mandatory; they enforce rhythm variety.

### Nav (sticky)
Left: GYSPC wordmark (serif, small caps or tight tracking). Center/right: `Tracks · Format · Timeline · FAQ · Hosts`. Far right: **Register** primary button (links to `registrationUrl` or disabled with `TBA` tooltip). Mobile: full-screen menu, serif links. Shrinks on scroll with a hairline bottom border.

### §00 Hero — the edited headline
- Left-aligned, large serif headline built as an *edit in progress*:
  > Science asks ~~what we can do~~ ^what we should do.
  The strikethrough and caret-insertion are drawn by `<Redline>` in sequence on load (≈1.2s total). Reduced motion: show final state.
- Beneath: body line naming the competition, then a mono line: `GLOBAL · HYBRID · 4 TRACKS · REGISTRATION OPENS OCT 2026`.
- "Hosted by Interscholastic Ethics Society Global Foundation × STEMise" with both logos (placeholders if files not provided: use text wordmarks, never fake logos).
- Two CTAs: **Register** (primary) and **Read the tracks** (ghost, anchors to §02).
- Margin column: a `<MarginNote>` reading *"Every technology is also a policy question."*
- **Not allowed:** centered layout, badge pill, stat pill row.

### §01 The Premise
- Asymmetric two-column: a short manifesto paragraph (3–4 sentences) in main column; a large serif pull quote in the margin column. Explain that entrants research a scientific/technological issue *and* propose a policy response — both halves are judged.

### §02 Tracks — the centerpiece (see Phase 3 for illustrations)
- **Not a card grid.** Use a vertical "index of plates": each track is a full-width row separated by hairlines, alternating illustration left/right.
- Each row contains: mono plate number (`PLATE I` – `PLATE IV`), serif track name, topic list rendered as mono tags separated by ` / `, a one-sentence framing question in serif italic (draft below, editable), and the track's illustration.
- Draft framing questions:
  - AI & Digital Society — *When a machine can fake a face, who is responsible for the truth?*
  - Bioethics & Health — *If we can edit life, who gets to write the rules?*
  - Climate & Environmental Technology — *Who consents to engineering the sky?*
  - Future Society — *Who is the smart city smart for?*
- Footnote beneath the list (mono, small): `¹ One winner is selected per track.`

### §03 Format — Prelim → Final
- A horizontal two-stage diagram (stacks vertically on mobile): **Online Preliminary** → **In-person Final**, joined by an arrow drawn as an ink line. Under each: what happens (use `TBA` for unknowns like venue). Frame it like a figure: `FIG. 1 — Competition format` caption in mono.

### §04 Timeline — the redlined calendar
- A vertical timeline styled like a dated ledger: mono dates in left gutter, serif milestone names, hairline between entries.
- Compute `status` from today's date: past milestones get a thin ink strike; the **current/next** milestone gets a hand-drawn red circle (`<Redline mode="circle">`); upcoming stay plain.
- Submission deadline shows `<TBA />`. Finals: "February 2027" + `<TBA label="exact date" />`.

### §05 Who can enter / Submission
- Two narrow text columns: **Eligibility** and **What you submit**. All `TBA` fields for now, rendered gracefully (the section must still look intentional with placeholders — use a margin note: *"Full rules will be published when registration opens."*).

### §06 Judging & Prizes
- A simple two-column table-like layout with hairlines (not cards): judging criteria on left, prizes on right. Both `TBA` for now. Hide the judges sub-block entirely if `judges.length === 0`.

### §07 Hosts
- Two equal blocks with hairline divider: **Interscholastic Ethics Society Global Foundation** (the humanities/ethics voice) and **STEMise** (the STEM voice — include a one-line description consistent with stemise.org: an international youth-led nonprofit running free global STEM competitions and hackathons, supporting student-led chapters). Link STEMise to https://www.stemise.org. The two blocks visually mirror the site's two type voices: IES block title in serif, STEMise block uses the `--stemise` accent.
- Optional scrolling partner-logo belt (STEMise-style), only if logos are supplied. Pause on hover; static under reduced motion.

### §08 FAQ
- Accessible accordion (`<details>`/`<summary>` or ARIA-correct button). Serif questions, sans answers. Seed with question placeholders only (e.g. "Who can participate?", "Can I enter as a team?", "Is there a fee?", "Where is the final held?") with answers `TBA`.

### §09 Closing CTA band
- Full-width `--paper-2` band. Serif line: *"The future needs people who can read both the data and the room."* Register button + contact email.

### Footer
- Column structure borrowed from stemise.org: **Competition** (Tracks, Timeline, FAQ) · **Hosts** (IES Global Foundation, STEMise) · **Contact** (email, socials — `TBA` if absent). Bottom line: `© 2026 GYSPC · Hosted by Interscholastic Ethics Society Global Foundation × STEMise`.

**✅ Phase 2 acceptance**
- [ ] All sections render from `site.ts`; zero hard-coded facts in components
- [ ] No two consecutive sections share a layout pattern
- [ ] Nav anchors scroll to correct sections with offset for sticky nav
- [ ] Every `TBA` looks deliberate, not broken
- [ ] Mobile (375px), tablet (768px), desktop (1440px) all checked

---

## 6. Phase 3 — Track illustrations (content-mapped, buildable)

Each track gets **its own purpose-built SVG object** that expresses *science being annotated by policy*. All four share one construction language: 1.5px ink strokes, flat fills from the palette only, mono labels, red marks for the "policy" layer. These are simple geometric/diagrammatic compositions — deliberately buildable in code. Do **not** attempt painterly or detailed figurative art.

| Track | Science layer (ink + mono) | Policy layer (red) |
|---|---|---|
| **AI & Digital Society** | A face rendered as a halftone dot grid (circles of varying radius from a simple radial function), with a mono label `SOURCE: UNVERIFIED` | A red bracket around half the face with a caret note *"consent?"* |
| **Bioethics & Health** | A DNA base sequence written as mono text `ATG CGT TAC …` in a line, like a sentence | One codon struck through in red with a replacement inserted above — gene editing literally shown as text editing |
| **Climate & Env. Tech** | A plotted line chart (CO₂-style rising curve) on a faint grid with mono axis labels | A red intervention line bending the curve down, annotated *"at whose risk?"* |
| **Future Society** | A top-down city street grid of rectangles (blocks) with small dots (people) | Red dashed sightlines radiating from a few camera points, one block circled |

Animation (Framer Motion, scroll-triggered once): ink layer draws/fades in first, then red layer draws on ~300ms later. Reduced motion: final state, no animation.

**✅ Phase 3 acceptance**
- [ ] All four illustrations share stroke weight and palette
- [ ] Red appears only in the "policy" layer of each
- [ ] Each illustration has an `aria-label` describing it; decorative sub-elements `aria-hidden`
- [ ] Illustrations fill their row without leaving dead space (check the density at 1440px)

---

## 7. Phase 4 — Motion & polish

1. Section headers: hairline rule extends left→right on enter (`--t-slow`).
2. Margin notes fade in 150ms after their section's main content.
3. Nav active-link indicator: a small red underline that moves between links via scroll spy.
4. No parallax, no scroll-jacking, no cursor trails.
5. Page-wide density audit: for each section at 1440px, confirm whitespace is intentional breathing room, not an empty void. Fix any section where one element floats alone.
6. Consistency audit (do before anything new): every red mark means "policy decision"; mono only for data/labels; serif only for voice/headlines; no leftover default styles.

---

## 8. Phase 5 — SEO, performance, deploy

1. `<title>`: `GYSPC — Global Youth Science & Policy Competition`; meta description (~150 chars) naming both hosts and the four tracks.
2. Open Graph image: 1200×630, generated as a static SVG→PNG using the hero's edited headline on `--paper`.
3. Favicon: a small serif "G" with a red caret.
4. `font-display: swap`; preload headline font; subset where possible.
5. Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
6. Deploy to Vercel (or GitHub Pages with Vite `base` set). Add a `README.md` explaining: how to edit `site.ts`, how to swap in logos, how to change a date.

**✅ Final acceptance**
- [ ] Lighthouse targets met on mobile
- [ ] Keyboard-only walkthrough of the entire page works
- [ ] `prefers-reduced-motion` verified
- [ ] None of the banned tells from §0.4 present
- [ ] A non-developer could update the timeline by editing one file

---

## 9. What to hand back
1. Repo with the structure above
2. `docs/reference-notes.md` (stemise.org observations)
3. `README.md` (editing guide)
4. Screenshots at 375 / 768 / 1440 px
5. A short list of every `TBA` field still awaiting real content
