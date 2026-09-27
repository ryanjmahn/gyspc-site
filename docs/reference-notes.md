# stemise.org — reference notes

Captured 2026-09-27 with headless Chromium (Playwright) at 1440×900 and 390×844.
Screenshots live in [`docs/reference/`](reference/):
`stemise-desktop-fold.jpg`, `stemise-desktop-full.jpg`, `stemise-mobile-fold.jpg`,
`stemise-mobile-full.jpg`, `stemise-footer.jpg`, `stemise-closing.jpg`.

Values below were sampled from computed styles, not guessed.

## What stemise.org actually uses

| Token           | Value                                                              | Where                                                                               |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Brand blue      | `#2B4BFF` (rgb 43 75 255)                                          | primary buttons, "Build it." highlight slab, links, most-used bg colour on the page |
| Ink / text      | `#101733` (rgb 16 23 51)                                           | headlines, borders, body text                                                       |
| Secondary text  | `#3E4869`, `#626C8C`                                               | paragraphs, captions                                                                |
| Page background | `#F6F7FB` + a visible square grid (graph paper)                    | hero, alternating bands                                                             |
| Card fill       | `#FFFFFF`                                                          | cards, secondary buttons                                                            |
| Pastel accents  | `#BFD0FF` blue, `#FFDD4A` yellow, `#FBC79B` peach, `#CDEBA1` green | the floating 3D "blocks" in the hero, tags                                          |

**Fonts**

- Headlines: **JetBrains Mono**, weight 800, very large (h1 118px, h2 46–68px), tight leading.
- Body: **Outfit** (geometric sans), ~20px in hero lede.
- UI (nav, buttons, labels): JetBrains Mono 13–15px, weight 500.

**Spacing rhythm:** generous — section padding-top ≈ 166px on desktop; content centred in a ~1200px column.

**Nav pattern:** logo + wordmark left; a pill-shaped segmented nav in the centre
(`Home · Programs ▾ · News · Get Involved · About`, Programs is a dropdown);
social icons + two buttons on the right — "Get involved" (outline) and **Donate** (solid blue, primary).
On mobile the centre nav collapses; the primary button stays visible.

**Button style:** fully rounded (999px) pills, 2px ink border, a hard offset "3D" shadow
(solid darker slab under the button, no blur). Monospace label, arrow glyph `→` on primary.

**Voice:** short imperative headline ("Don't study STEM. Build it."), one plain-sentence lede,
section heads phrased as claims ("Numbers we can point at", "Help more students find real opportunities").

**Page structure:** hero → programs row → "IMPACT / Numbers we can point at" stat block →
scrolling country belt → partner-organisation logos → "worked at" logo belt → upcoming events →
closing "Get involved" band (dark `#101733` with blue CTA) → footer.

**Footer:** STEMise wordmark + fiscal-sponsor note; three columns **EXPLORE** (Events, Curriculum,
News, Impact) · **JOIN** (Join our team, Start a chapter, Donate) · **COMMUNITY** (Email, Instagram,
LinkedIn); bottom line `© 2026 STEMise · stemise.org`.

## What GYSPC borrows

- **Headline voice:** confident, short, declarative. Our hero is an _edit_ of a sentence rather than an imperative, but keeps the same brevity.
- **Nav anatomy:** wordmark left, section links centre-right, one **solid primary CTA** far right (Register).
  We have no sub-programs, so no dropdown.
- **Credibility block** in spirit: GYSPC has no numbers yet, so the equivalent is the mono "data line" under the hero
  (`GLOBAL · HYBRID · 4 TRACKS · REGISTRATION OPENS OCT 2026`) — only facts we can point at.
- **Logo belt:** implemented as an optional component that renders only when partner logos are supplied.
- **Closing band:** a full-width "get involved" strip with one line + CTA + contact.
- **Footer columns:** same three-column logic, renamed **Competition · Hosts · Contact**.
- **JetBrains Mono** — STEMise's signature face — is our _science voice_. Same font, narrower job: data labels only.
- **`#2B4BFF`** is kept verbatim as `--stemise`, used only on STEMise-attributed elements.

## What GYSPC changes (and why)

STEMise reads as a pure STEM/maker org: graph-paper grid, toy-block pastels, chunky 3D pill buttons,
mono headlines. GYSPC is the _intersection of STEM and the humanities_, so:

| stemise.org                            | GYSPC                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| cool blue-white bg + graph grid        | warm paper `#F6F3EC` + ≤3% noise, hairline rules                                           |
| mono headlines                         | **Fraunces** serif headlines (humanities voice); mono demoted to labels                    |
| Outfit body                            | **IBM Plex Sans** body (more neutral, bookish pairing with Fraunces)                       |
| blue primary CTA, pill + offset shadow | **UN blue** `#0069B4` primary, 3px radius, flat — the mark colour means "a decision"       |
| pastel floating blocks                 | none; illustrations are content-mapped diagrams per track                                  |
| centred hero + badge pill              | left-aligned manuscript layout with a margin column (badge-pill formula is banned by spec) |
| dark closing band                      | `--paper-2` closing band (stays light, editorial)                                          |

## Type choice (documented per spec §3.1)

| Role             | Face                                   | Why                                                                                    |
| ---------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| Humanities voice | **Fraunces** (variable, opsz + italic) | strong, characterful italic for margin notes; optical sizing keeps big headlines crisp |
| Science voice    | **JetBrains Mono**                     | shared with stemise.org → visible family resemblance                                   |
| Body             | **IBM Plex Sans**                      | neutral, highly legible, pairs with an editorial serif                                 |

## Revision — 2026-09-27: STEM × UN palette

At the client's request the warm "paper / ink / redline" palette was replaced with a STEM × United Nations/UNESCO feel:
cool white `#F7F9FC`, pale-blue bands `#E6EFF7`, deep navy ink `#0B1F3A`, and UN blue `#0069B4` as the mark colour
(the brighter UN cyan `#009EDB` fails AA as text on white, so the deeper UNESCO-range blue is used). The red editor's
pen became a blue pencil — also a real editorial convention — so marks keep their "policy decision" meaning. The footer is a navy band.
`--stemise` `#2B4BFF` is unchanged.

## Revision — 2026-09-27: IES, white pages, global palette

- **IES (ie-society.com)** captured in `docs/reference/ies-desktop-*.jpg`: navy `#10244C`, orange accent `#CF6317`,
  cream `#F8F6F2`, Playfair Display headlines, tagline "Ethics in Action". Kept as host-only tokens `--ies` (navy, used
  for IES text) and `--ies-accent` (orange, graphics only — 3.85:1 fails AA as text). Seal logo from the site in `public/logos/ies.webp`.
- The co-host is named **IES / Interscholastic Ethics Society** (not "Global Foundation"), per the client.
- Pages are now white, and each section takes one accent from a UN SDG-inspired palette (darkened to pass AA as text on white and on its tint).
  The editing marks take their section's accent.
- Added a dot-matrix globe (Natural Earth land data) with the four tracks in orbit, a "global issues" ticker, and a crowd of figures for society.
