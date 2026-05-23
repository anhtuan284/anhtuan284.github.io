# Portfolio Redesign — Design Spec

**Date:** 2026-05-23
**Branch:** `feat/enhance-layout`
**Owner:** Tuan Truong Bui Anh
**Goal:** Rebuild the portfolio so it reads like a "dev story" — a hi-tech, minimal-engineering aesthetic with subtle motion, first-person voice, and full responsive support. Zero new dependencies.

## Decisions (Locked)

| Topic        | Choice                                              |
| ------------ | --------------------------------------------------- |
| Vibe         | Minimal Engineering (Linear / Vercel / Stripe tier) |
| Palette      | Vercel-style: pure black/white, gradient accents    |
| Default theme| Dark                                                |
| Hero         | Oversized stacked name, mono eyebrow, gradient rule |
| Motion level | Subtle                                              |
| Voice        | First-person, candid                                |
| Anim tech    | CSS + IntersectionObserver only (no new deps)       |
| Scope        | Home + project detail pages                         |

## Architecture

Next.js 15 static export (unchanged). React 19 server components by default. Animation lives in 3 small client islands.

### File changes

| Path | Change |
| --- | --- |
| `app/globals.css` | Full rewrite. New tokens, motion primitives, responsive grid, type scale. |
| `app/components/Reveal.tsx` | **New.** Client. `IntersectionObserver` adds `.in-view` on first intersect. |
| `app/components/CursorGlow.tsx` | **New.** Client. Fixed radial gradient follows pointer. |
| `app/components/Typed.tsx` | **New.** Client. Types a string, blinks cursor. |
| `app/components/Nav.tsx` | Restyle. Add scroll-progress hairline. Active-section logic kept. |
| `app/components/ProjectsList.tsx` | Restyle card. Gradient hover border, status pills. |
| `app/components/VizGrid.tsx` | Restyle frame; behavior kept. |
| `app/components/Pager.tsx` | Restyle, gradient hairline on hover. |
| `app/page.tsx` | Restructure markup, rewrite copy, wrap sections in `<Reveal>`. |
| `app/projects/[slug]/page.tsx` | Restyle hero + body; copy unchanged. |
| `app/layout.tsx` | Mount `<CursorGlow>`. Update metadata description. |

### Fonts

Keep both: JetBrainsMono Nerd Font + Source Serif 4. Promote mono as the "voice of the system" (eyebrows, labels, meta, dates, chips). Demote serif to body text + the oversized hero name.

## Design Tokens

### Colors

```
:root {                  /* dark, default */
  --bg:        #050505;
  --surface:   #0a0a0a;
  --surface-2: #111111;
  --ink:       #fafafa;
  --muted:     #a1a1a1;
  --soft:      #6b6b6b;
  --rule:      #1f1f1f;
  --rule-2:    #2a2a2a;
  --grad-a:    #fafafa;
  --grad-b:    #6b6b6b;
  --glow:      rgba(250,250,250,.06);
  --ok:        #4ade80;
}
:root[data-theme='light'] {
  --bg:#fafafa; --surface:#fff; --surface-2:#f4f4f4;
  --ink:#0a0a0a; --muted:#525252; --soft:#a1a1a1;
  --rule:#e5e5e5; --rule-2:#d4d4d4;
  --grad-a:#0a0a0a; --grad-b:#737373;
  --glow:rgba(10,10,10,.04);
}
```

No saturated brand color. Emphasis comes from white→grey gradients + glow.

### Type scale (fluid via `clamp()`)

- `--fs-hero`: `clamp(3.5rem, 9vw, 7rem)` — hero name
- `--fs-h2`:   `clamp(1.6rem, 3vw, 2.2rem)` — section headings
- `--fs-h3`:   `1.15rem`
- `--fs-body`: `1rem` (16px; tighter than current 18px)
- `--fs-mono`: `0.8rem`
- `--fs-tiny`: `0.7rem`

### Spacing

- `--gap-1..24`: 4, 8, 12, 16, 24, 32, 48, 64, 96
- `--max-w`: 1080px
- `--pad-x`: `clamp(20px, 5vw, 48px)`

### Motion

- `--ease`:     `cubic-bezier(.2,.7,.2,1)`
- `--ease-out`: `cubic-bezier(.16,1,.3,1)`
- `--dur-1..4`: 120ms, 240ms, 480ms, 800ms

### Effects

- Hairline gradient rule: `linear-gradient(90deg, transparent, var(--rule-2) 20%, var(--rule-2) 80%, transparent)`
- Text gradient: `linear-gradient(135deg, var(--grad-a), var(--grad-b))` for highlighted phrases.
- Card hover border: `background-clip: border-box` trick with animated `@property --angle: 0deg → 360deg` over 4s.
- Background grain: 1KB inlined SVG noise at 3% opacity, `position: fixed`, `z-index: 0`.

## Components

### `<Reveal as="section" delay={0}>`

- `IntersectionObserver`, `threshold: 0.12`, `rootMargin: '0px 0px -10% 0px'`.
- On first intersect: add class `.in-view`.
- CSS animates the children — opacity 0 → 1, `translateY(16px → 0)`, duration `--dur-3`, stagger via `--delay` CSS var on each child (`style={{ '--delay': i*60+'ms' }}`).
- Respects `prefers-reduced-motion: reduce` (renders instantly).

### `<CursorGlow>`

- Mounts once in `layout.tsx`.
- Fixed `<div>` covering viewport, `pointer-events: none`, `z-index: 0`.
- `pointermove` updates CSS vars `--mx`, `--my` (rAF-throttled).
- Background: `radial-gradient(600px circle at var(--mx) var(--my), var(--glow), transparent 40%)`.
- Disabled on touch (`matchMedia('(hover: none)')`) and `prefers-reduced-motion`.

### `<Typed text="..." speed={45}>`

- Types characters with `setTimeout`, blinks underscore cursor at end.
- Reduced-motion: renders full string instantly, no blink.
- Renders full text to DOM up front, animates *visibility* via CSS clip — screen readers receive full string.

### `<ScrollProgress>` (inside `<Nav>`)

- 1px gradient bar at top of nav, width = scroll percentage.
- Pure CSS gradient + rAF-throttled scroll listener.

### Project card hover (pure CSS)

- Gradient border via dual `background-clip`.
- Animated `@property --angle: 0deg → 360deg` (4s linear infinite) on hover only.
- Cover image: scale 1.03, brightness +5%.
- Card: `translateY(-2px)`, soft white glow `box-shadow`.

### Section heading

- `<h2>` prefixed by mono counter `01 · About`, `02 · Skills`, etc. via CSS counter on `<section>`.
- Below: gradient hairline (not solid border).

### Skills

- Five labeled rows. Label sits left (mono); chips on right.
- Chips: monospace, padded, gradient border on hover, stagger-reveal on first intersect.

### Experience timeline

- 16px-wide left rail (vertical hairline).
- Entries on right. Each entry has a 4px dot protruding into the rail; dot pulses on hover.
- Date in mono, role+company in serif, bullets prefixed by `→`.

### Project card grid

- 2-up grid (`≥860px`) → 1-up (`<860px`).
- Status pill colors: `LIVE` (white dot), `IN-PROGRESS` (pulsing dot), `ARCHIVED` (soft dot).

### Footer

- Three columns: `> reach`, `> elsewhere`, `> meta`. Mono labels.
- Gradient hairline top.
- Bottom: `© 2026 ttba.dev` + static build timestamp.

## Page Layout

### Section order (home)

1. **Hero (00)** — eyebrow, oversized name, gradient hairline, lede, status row, social row.
2. **About (01)** — one paragraph + `now.txt` aside (desktop ≥860px).
3. **Skills (02)** — labeled chip rows.
4. **Experience (03)** — timeline rail with 2 entries.
5. **Projects (04)** — 2-up grid + filter bar.
6. **Education (05)** — 2 compact entries.
7. **Recognition (06)** — bullets with mono prefixes.
8. **Contact (07)** — 3-col footer.

### Hero anatomy

- Eyebrow: mono, typed on load (~600ms total), blinking `_` cursor after.
- Name: serif, `--fs-hero`, weight 600, `letter-spacing: -.04em`, `line-height: 0.92`. Three stacked lines (`Tuan / Truong / Bui Anh.`). Final `.` is a gradient dot.
- Gradient hairline below name: width animates 0 → 50% over 800ms on load.
- Lede: serif, `1.15rem`, muted. Two sentences max.
- Status row: mono, single line — `▌ now: building PiEx · listening: lofi · last commit: 2h ago`. Static text, updated by hand.
- Social row: mono, underline on hover only.

### Background

- `--bg` (#050505) base.
- Inlined SVG grain at 3% opacity, fixed.
- `<CursorGlow>` fixed, above background, below content.
- Above-the-fold: faint radial fade from top-left (white → transparent at 5%, ~600px).

### About section + `now.txt` aside (≥860px)

```
> now.txt
─────────────
role  · mobile eng @ pitek
stack · flutter · firebase · dart
free  · weekends, side contracts
loc   · district 7, hcmc, vn
mail  · dev.atuan03@gmail.com
```

Stacks under the paragraph on `<860px`.

### Project detail page (`/projects/[slug]`)

- Breadcrumb (mono): `← work / <slug>`.
- Hero: scale `clamp(2.4rem, 6vw, 4.5rem)`, tagline below.
- Body content unchanged.
- Pager bottom: gradient-border cards.

## Copy Rewrite

### Eyebrow (typed)

```
▌ MOBILE_ENGINEER · HCMC · OPEN_TO_WORK
```

### Lede

> I build mobile apps that ship. Currently shipping Flutter + Firebase at PITEK — before that, R&D on RAG pipelines at Azera. I like picking up the thing I don't know yet.

### About

> I'm a mobile engineer based in Ho Chi Minh City. I work across the stack when I have to — backend, ML pipelines, the occasional cross-platform client — but mobile is where I do my best work right now. I treat each new project as the cheapest way to learn something I didn't know last quarter, and I aim for code that ships and stays shipped.

### Skills (row labels + items)

- `lang/`    Dart · Java · SQL · Python · TypeScript · C++
- `mobile/`  Flutter · Firebase · GetX · Bloc
- `web/`     Spring MVC · Flask · Django · ASP.NET · React
- `ml/data/` TensorFlow · PyTorch · MySQL · MSSQL
- `infra/`   Docker · Linux · Git

### Experience

**PITEK Joint Stock Company — Mobile Engineer**
`NOV 2025 → NOW · Bình Thạnh, HCMC · on-site · full-time`

→ **PiCare** — shipping features across the resident and agent apps; both ends of the property-management flow.
→ **PiEx** — solo build of the secondary platform that moves real-estate exchange online. Sellers and landlords meet under a monopoly contract so every listing on the exchange is verified and trustworthy.
→ **PiEx** — built a map view that visualizes house prices by area, so users can read the local market at a glance.
→ Partnered with the front-end lead to harden parts of the auth flow.
→ Stack: Flutter · Firebase · Dart.

**Azera Vietnam — Software Developer**
`AUG 2024 → NOV 2025`

→ R&D on an ingestion RAG pipeline for asset querying and search completion.
→ Shipped new features and maintained the core codebase end-to-end.
→ Sat in on market research and contributed to an MVP launch.
→ Picked up design patterns and tooling I still use today.

### Projects section heading

> Things I built — by myself or with small teams. Some shipped, some are still cooking, some sit as lessons.

(Existing project list/blurbs unchanged.)

### Education

- B.Sc. Computer Science — *Ho Chi Minh City Open University* · `OCT 2021 → NOW`
- Big Data Track — *Samsung Innovation Campus* · `JUN 2024 → AUG 2024`

### Recognition

→ 4th Prize, Student Informatics Olympiad 2024 — Open Source Software track.
→ Consolation Prize, Scientific Research — automated student attendance via cornea tracking.

### Footer (3 columns)

```
> reach                    > elsewhere                  > meta
mailto:dev.atuan03         github.com/anhtuan284       © 2026 ttba.dev
(+84) 37 782 2815          linkedin.com/in/tuantba     built 2026-05-23
                                                       hcmc · vn
```

## Responsive

| Breakpoint     | Behavior |
| -------------- | -------- |
| `≥1080px`      | Full layout. `now.txt` aside visible. 2-up projects. 3-col footer. |
| `860–1079px`   | Same minus `now.txt` aside (stacks under About). |
| `640–859px`    | Single-col projects. 2-col footer. Hero name tighter. |
| `<640px`       | Single-col everything. 1-col footer. `<CursorGlow>` disabled (touch). |
| `<400px`       | Chips wrap tighter. Padding shrinks via `clamp()`. |

- All primary type sized via `clamp()` — no JS resize listeners.
- Hover-only effects gated by `@media (hover: hover) and (pointer: fine)`.
- Tap targets ≥44px.

## Accessibility

- `prefers-reduced-motion: reduce` → all reveals instant; no typed text animation; no cursor glow; no animated gradients.
- Contrast: `--muted` on `--bg` = 5.7:1 (AA). `--ink` on `--bg` = 18:1 (AAA).
- Skip link kept.
- Visible focus ring on all interactive elements (gradient outline, `outline-offset: 3px`).
- Theme toggle: `aria-label="Toggle theme"`, `aria-pressed`.
- Semantic HTML preserved.
- `<Typed>` writes full string to DOM up front; animates visibility, not content.

## Performance

- Static export unchanged.
- New JS: ~3KB gzipped across 3 client islands.
- Zero new external requests (grain SVG inlined).
- Lighthouse target: 100/100/100/100.

## SEO

- Metadata structure unchanged.
- OG description in `app/layout.tsx` updated to match new lede.

## Out of Scope

- New sections (now-playing ticker, GitHub activity strip, blog, contact form).
- New deps (framer-motion, GSAP, lottie).
- Removing serif font.
- Changing routing or data model.
- Editing `app/data/projects.ts` content.
- Light theme overhaul beyond mirroring tokens.

## Risks / Notes

- **Type scale shrinks body from 18px → 16px.** Denser dev feel; verify legibility on iPhone SE-class screens during implementation.
- **Animated `@property --angle`** requires Chrome 85+ / Safari 16.4+ / Firefox 128+. On older browsers the gradient border still appears, just static.
- **Inlined grain SVG** ships in every page's HTML (~1KB) — accepted as part of dark theme.
- **`<Typed>` flickers if React hydration races** — mitigation: render full text immediately, animate via CSS `clip-path: inset()`. Documented in component.
