# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio with a Vercel-style minimal-engineering aesthetic — oversized name hero, subtle CSS-only motion, first-person copy, dark default, fully responsive. Zero new dependencies.

**Architecture:** Keep Next.js 15 static export + React 19 server components. Three small client islands (`Reveal`, `CursorGlow`, `ScrollProgress`). One server-only `Typed` component driven by CSS. Full rewrite of `app/globals.css` introducing new token system; markup updates section-by-section in `app/page.tsx` and `app/projects/[slug]/page.tsx`.

**Tech Stack:** Next.js 15, React 19, TypeScript, plain CSS (no PostCSS additions), IntersectionObserver, CSS custom properties + animations.

**Spec:** `docs/superpowers/specs/2026-05-23-portfolio-redesign-design.md`

**Verification approach (no unit tests in repo):** Each task ends with `npm run build` (must succeed) + `npx tsc --noEmit` where TS is touched. Final task runs the dev server and walks through the page in a browser at 3 viewport widths (≥1080, 760, 380) and toggles `prefers-reduced-motion` via DevTools.

---

## File Structure

| File | Status | Responsibility |
| --- | --- | --- |
| `app/globals.css` | Rewrite | Tokens, base, layout, all section styles, motion primitives, responsive, reduced-motion. |
| `app/layout.tsx` | Modify | Mount `<CursorGlow>`. Update OG description. |
| `app/components/Reveal.tsx` | Create | Client. IntersectionObserver-driven `.in-view` toggle. |
| `app/components/CursorGlow.tsx` | Create | Client. Pointer-following radial gradient. |
| `app/components/Typed.tsx` | Create | Server. Sets `--len` CSS var on a span; CSS does the type-in. |
| `app/components/Nav.tsx` | Modify | Brand rename → `ttba.dev`, sections list update, scroll-progress hairline. |
| `app/components/ProjectsList.tsx` | Modify | Status pill with colored dot variants. |
| `app/components/Pager.tsx` | Modify | Restyle (class additions only). |
| `app/components/VizGrid.tsx` | Modify | Restyle (class additions only). |
| `app/page.tsx` | Modify | Hero + about + skills + experience + projects + edu + recognition + footer markup + first-person copy. |
| `app/projects/[slug]/page.tsx` | Modify | Crumb restyle, hero restyle. Body unchanged structurally. |

---

## Task 1: Add `<Reveal>` client component

**Files:**
- Create: `app/components/Reveal.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
};

export default function Reveal({
  as: Tag = 'div',
  children,
  className,
  id,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`reveal${seen ? ' in-view' : ''}${className ? ' ' + className : ''}`}
      style={delay ? ({ ['--reveal-delay' as string]: `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/peter/Desktop/my_project/anhtuan284.github.io && npx tsc --noEmit`
Expected: exit 0, no output.

Run: `cd /Users/peter/Desktop/my_project/anhtuan284.github.io && npm run build`
Expected: "Compiled successfully" and exit 0.

- [ ] **Step 3: Commit**

```bash
git add app/components/Reveal.tsx
git commit -m "feat(components): add Reveal client island for IntersectionObserver-driven section animations"
```

---

## Task 2: Add `<CursorGlow>` client component

**Files:**
- Create: `app/components/CursorGlow.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const apply = () => {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add app/components/CursorGlow.tsx
git commit -m "feat(components): add CursorGlow pointer-following radial gradient"
```

---

## Task 3: Add `<Typed>` server component

**Files:**
- Create: `app/components/Typed.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { CSSProperties } from 'react';

type TypedProps = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
};

export default function Typed({ text, speed = 45, delay = 200, className }: TypedProps) {
  const style: CSSProperties = {
    ['--len' as string]: text.length,
    ['--type-speed' as string]: `${speed}ms`,
    ['--type-delay' as string]: `${delay}ms`,
  };
  return (
    <span className={`typed${className ? ' ' + className : ''}`} style={style} aria-label={text}>
      {text}
    </span>
  );
}
```

This is a server component. All animation lives in CSS, driven by the `--len`, `--type-speed`, `--type-delay` custom properties.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add app/components/Typed.tsx
git commit -m "feat(components): add Typed text wrapper (CSS-driven typewriter)"
```

---

## Task 4: Rewrite `app/globals.css`

This is the biggest single task. The file already wires up class names used throughout the codebase; we keep those names and re-skin them. New class names introduced by later tasks are added here pre-emptively so markup updates render correctly.

**Files:**
- Rewrite: `app/globals.css`

- [ ] **Step 1: Replace the entire file with the content below**

```css
/* ─────────────── fonts ─────────────── */
@font-face {
  font-family: 'JetBrainsMono Nerd Font';
  src: url('/fonts/jbm-nerd-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'JetBrainsMono Nerd Font';
  src: url('/fonts/jbm-nerd-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* ─────────────── tokens ─────────────── */
:root {
  --bg: #050505;
  --surface: #0a0a0a;
  --surface-2: #111111;
  --ink: #fafafa;
  --muted: #a1a1a1;
  --soft: #6b6b6b;
  --rule: #1f1f1f;
  --rule-2: #2a2a2a;
  --grad-a: #fafafa;
  --grad-b: #6b6b6b;
  --glow: rgba(250, 250, 250, 0.06);
  --ok: #4ade80;

  --mono: 'JetBrainsMono Nerd Font', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  --max-w: 1080px;
  --pad-x: clamp(20px, 5vw, 48px);

  --fs-hero: clamp(3.5rem, 9vw, 7rem);
  --fs-h2: clamp(1.6rem, 3vw, 2.2rem);
  --fs-h3: 1.15rem;
  --fs-body: 1rem;
  --fs-mono: 0.8rem;
  --fs-tiny: 0.7rem;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-1: 120ms;
  --dur-2: 240ms;
  --dur-3: 480ms;
  --dur-4: 800ms;
}

:root[data-theme='light'] {
  --bg: #fafafa;
  --surface: #ffffff;
  --surface-2: #f4f4f4;
  --ink: #0a0a0a;
  --muted: #525252;
  --soft: #a1a1a1;
  --rule: #e5e5e5;
  --rule-2: #d4d4d4;
  --grad-a: #0a0a0a;
  --grad-b: #737373;
  --glow: rgba(10, 10, 10, 0.04);
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    --bg: #fafafa;
    --surface: #ffffff;
    --surface-2: #f4f4f4;
    --ink: #0a0a0a;
    --muted: #525252;
    --soft: #a1a1a1;
    --rule: #e5e5e5;
    --rule-2: #d4d4d4;
    --grad-a: #0a0a0a;
    --grad-b: #737373;
    --glow: rgba(10, 10, 10, 0.04);
  }
}

/* ─────────────── reset ─────────────── */
* { box-sizing: border-box; }

html, body { margin: 0; padding: 0; scroll-behavior: smooth; }

body {
  font-family: var(--font-serif), Georgia, 'Times New Roman', serif;
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--ink);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  opacity: 0.03;
  mix-blend-mode: overlay;
}

a {
  color: var(--ink);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: var(--rule-2);
  transition: text-decoration-color var(--dur-1) var(--ease),
              color var(--dur-1) var(--ease);
}
a:hover { color: var(--ink); text-decoration-color: var(--ink); }

::selection { background: var(--ink); color: var(--bg); }

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
  border-radius: 2px;
}

/* ─────────────── cursor glow ─────────────── */
.cursor-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    var(--glow),
    transparent 40%
  );
  transition: background-position 0s;
}

/* ─────────────── top nav ─────────────── */
.topnav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--rule);
}

.topnav-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 14px var(--pad-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  position: relative;
}

.topnav .scroll-progress {
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 1px;
  width: var(--scroll, 0%);
  background: linear-gradient(90deg, transparent, var(--ink), transparent);
  pointer-events: none;
  transition: width 80ms linear;
}

.brand {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  text-decoration: none;
  color: var(--ink);
}
.brand .dot { color: var(--muted); }

.topnav ul {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.topnav ul a {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.04em;
  color: var(--muted);
  text-decoration: none;
  padding: 4px 0;
  border-bottom: 1px solid transparent;
  transition: color var(--dur-1) var(--ease), border-color var(--dur-1) var(--ease);
}
.topnav ul a:hover { color: var(--ink); border-bottom-color: var(--ink); }
.topnav ul a[data-active='true'] { color: var(--ink); border-bottom-color: var(--ink); }

.topnav-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.theme-btn {
  background: transparent;
  border: 1px solid var(--rule-2);
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.9rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color var(--dur-1) var(--ease), border-color var(--dur-1) var(--ease),
              transform var(--dur-1) var(--ease);
  padding: 0;
}
.theme-btn:hover { color: var(--ink); border-color: var(--ink); transform: rotate(15deg); }

/* ─────────────── main / layout ─────────────── */
main {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 80px var(--pad-x) 120px;
  position: relative;
  z-index: 1;
}

/* ─────────────── hero ─────────────── */
header.intro {
  margin-bottom: 96px;
  scroll-margin-top: 80px;
}

header.intro .eyebrow {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin: 0 0 28px;
  display: block;
}

header.intro h1 {
  font-size: var(--fs-hero);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 0.92;
  margin: 0 0 24px;
}

header.intro h1 .dot-grad {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-rule {
  height: 1px;
  width: 50%;
  margin: 0 0 28px;
  background: linear-gradient(90deg, var(--ink), transparent);
  transform-origin: left;
  animation: rule-grow var(--dur-4) var(--ease-out) 0.3s both;
}
@keyframes rule-grow { from { transform: scaleX(0); } }

header.intro .lede {
  font-size: 1.15rem;
  color: var(--muted);
  margin: 0 0 24px;
  max-width: 56ch;
  line-height: 1.6;
}

.status-row {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--soft);
  letter-spacing: 0.04em;
  margin: 0 0 24px;
}

header.intro .social-links {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}

header.intro .social-links a {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.04em;
  color: var(--muted);
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  transition: color var(--dur-1) var(--ease), border-color var(--dur-1) var(--ease);
}
header.intro .social-links a:hover { color: var(--ink); border-bottom-color: var(--ink); }

/* ─────────────── sections ─────────────── */
main { counter-reset: section; }

section {
  margin: 80px 0;
  scroll-margin-top: 80px;
  counter-increment: section;
}

section > h2 {
  font-family: var(--mono);
  font-size: var(--fs-h2);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0 0 32px;
  padding-bottom: 16px;
  background-image: linear-gradient(90deg, var(--rule-2) 20%, transparent 80%);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 1px;
  display: flex;
  align-items: baseline;
  gap: 14px;
}

section > h2::before {
  content: counter(section, decimal-leading-zero);
  font-family: var(--mono);
  font-size: 0.95rem;
  color: var(--muted);
  letter-spacing: 0.1em;
  font-weight: 400;
}

section h3 { font-size: var(--fs-h3); font-weight: 600; margin: 0 0 6px; }

section p { margin: 0 0 12px; color: var(--ink); }

section ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

section ul li {
  margin: 0 0 10px;
  position: relative;
  padding-left: 22px;
  color: var(--muted);
}

section ul li::before {
  content: '→';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--soft);
  font-family: var(--mono);
}

section ul li strong { color: var(--ink); font-weight: 600; }

/* ─────────────── about + now.txt ─────────────── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
.about-grid p { margin: 0; }

@media (min-width: 860px) {
  .about-grid {
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 48px;
    align-items: start;
  }
}

.now-txt {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 18px 20px;
  line-height: 1.85;
  white-space: pre;
  overflow-x: auto;
}
.now-txt .now-label {
  color: var(--soft);
  display: block;
  margin-bottom: 6px;
}
.now-txt .now-rule {
  color: var(--rule-2);
  display: block;
  margin-bottom: 6px;
}
.now-txt .now-key { color: var(--soft); }
.now-txt .now-val { color: var(--ink); }

/* ─────────────── skills ─────────────── */
.skill-rows { display: flex; flex-direction: column; gap: 18px; }

.skill-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  align-items: start;
}

.skill-row .skill-label {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--soft);
  letter-spacing: 0.04em;
  padding-top: 6px;
}

.skill-row .skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 640px) {
  .skill-row { grid-template-columns: 1fr; gap: 8px; }
}

/* ─────────────── chips ─────────────── */
.chip {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--rule);
  padding: 5px 11px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.02em;
  transition: color var(--dur-1) var(--ease), border-color var(--dur-1) var(--ease);
}
.chip:hover { color: var(--ink); border-color: var(--ink); }
.chip .ico { font-size: 0.9rem; color: var(--muted); }
.chip.more { background: transparent; color: var(--soft); border-style: dashed; }

/* ─────────────── experience timeline ─────────────── */
.timeline {
  position: relative;
  padding-left: 24px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: var(--rule);
}

.entry {
  position: relative;
  margin: 0 0 36px;
}
.entry::before {
  content: '';
  position: absolute;
  left: -24px;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--rule-2);
  transition: background var(--dur-2) var(--ease), border-color var(--dur-2) var(--ease),
              transform var(--dur-2) var(--ease);
}
.entry:hover::before { background: var(--ink); border-color: var(--ink); transform: scale(1.2); }
.entry.current::before {
  background: var(--ink);
  border-color: var(--ink);
  box-shadow: 0 0 0 0 var(--ink);
  animation: pulse-dot 2.4s var(--ease) infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(250, 250, 250, 0.35); }
  50% { box-shadow: 0 0 0 6px rgba(250, 250, 250, 0); }
}

.entry h3 { font-family: var(--font-serif), serif; }
.entry .when {
  font-family: var(--mono);
  color: var(--muted);
  font-size: var(--fs-mono);
  letter-spacing: 0.04em;
  margin: 0 0 4px;
}
.entry .where {
  font-family: var(--mono);
  color: var(--soft);
  font-size: var(--fs-tiny);
  letter-spacing: 0.06em;
  margin: 0 0 12px;
  text-transform: uppercase;
}

/* ─────────────── filter bar ─────────────── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 28px;
}

.filter-btn {
  font-family: var(--mono);
  font-size: var(--fs-tiny);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--rule);
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: color var(--dur-1) var(--ease), border-color var(--dur-1) var(--ease),
              background var(--dur-1) var(--ease);
}
.filter-btn:hover { color: var(--ink); border-color: var(--ink); }
.filter-btn[aria-pressed='true'] {
  color: var(--bg);
  background: var(--ink);
  border-color: var(--ink);
}

/* ─────────────── projects grid ─────────────── */
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.proj {
  position: relative;
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 0 0 22px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
  transition: transform var(--dur-2) var(--ease), border-color var(--dur-2) var(--ease),
              box-shadow var(--dur-2) var(--ease);
}

@media (hover: hover) and (pointer: fine) {
  .proj::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 9px;
    padding: 1px;
    background: conic-gradient(
      from var(--angle, 0deg),
      transparent 0%,
      var(--rule-2) 30%,
      var(--ink) 50%,
      var(--rule-2) 70%,
      transparent 100%
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    opacity: 0;
    transition: opacity var(--dur-2) var(--ease);
    pointer-events: none;
  }
  .proj:hover::after {
    opacity: 1;
    animation: spin-angle 4s linear infinite;
  }
}
@keyframes spin-angle { to { --angle: 360deg; } }

.proj > *:not(.proj-cover) { margin-left: 22px; margin-right: 22px; }

.proj-cover {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-2);
  border-bottom: 1px solid var(--rule);
  position: relative;
}
.proj-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--dur-3) var(--ease), filter var(--dur-3) var(--ease);
  filter: grayscale(0.15) brightness(0.9);
}
.proj-cover:hover img { transform: scale(1.03); filter: grayscale(0) brightness(1); }

.proj-cover.empty {
  background: repeating-linear-gradient(
    45deg,
    var(--surface),
    var(--surface) 10px,
    var(--surface-2) 10px,
    var(--surface-2) 20px
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.proj-cover-ph {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--soft);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0 16px;
  text-align: center;
}

.proj-cover + .proj-head { margin-top: 6px; }

.proj:hover { transform: translateY(-3px); border-color: var(--rule-2); }

.proj-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.proj-head-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }

.proj-year {
  font-family: var(--mono);
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  color: var(--soft);
  margin: 0;
  text-transform: uppercase;
}

.proj-title { font-size: 1.05rem; font-weight: 600; margin: 0; line-height: 1.3; }
.proj-title a { color: var(--ink); text-decoration: none; }
.proj-title a:hover { color: var(--muted); }

.proj-status {
  font-family: var(--mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 4px 9px 4px 18px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
}
.proj-status::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--soft);
  transform: translateY(-50%);
}
.proj-status[data-variant='live']::before { background: var(--ink); }
.proj-status[data-variant='wip']::before {
  background: var(--ink);
  animation: pulse-dot 2.4s var(--ease) infinite;
}
.proj-status[data-variant='archived']::before { background: var(--soft); opacity: 0.5; }

.proj-blurb { font-size: 0.95rem; color: var(--muted); margin: 0; line-height: 1.55; }

.proj-stack { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }

.proj-foot {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px dashed var(--rule);
  font-family: var(--mono);
  font-size: var(--fs-mono);
}
.proj-foot a {
  color: var(--muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.proj-foot a:hover { color: var(--ink); }

/* ─────────────── project detail ─────────────── */
.crumb {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.04em;
  margin: 0 0 40px;
  color: var(--soft);
}
.crumb a { color: var(--muted); text-decoration: none; }
.crumb a:hover { color: var(--ink); }

.proj-hero {
  margin-bottom: 80px;
  padding-bottom: 36px;
  background-image: linear-gradient(90deg, var(--rule-2) 20%, transparent 80%);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 1px;
}

.proj-hero .eyebrow {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin: 0 0 20px;
}

.proj-hero h1 {
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 8px 0 20px;
}

.proj-hero .tagline {
  font-style: italic;
  color: var(--muted);
  font-size: 1.2rem;
  max-width: 60ch;
  margin: 0 0 24px;
  line-height: 1.5;
}

.team-line {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--soft);
  margin: -12px 0 24px;
  letter-spacing: 0.04em;
}

.proj-hero-foot {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.proj-hero-foot a.ext {
  color: var(--muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.proj-hero-foot a.ext:hover { color: var(--ink); }

.ext-disabled {
  font-family: var(--mono);
  color: var(--soft);
  font-size: var(--fs-mono);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.highlights { margin-top: 16px; }
.highlights li::before { content: '→'; }

.diagram {
  font-family: var(--mono);
  font-size: 0.78rem;
  line-height: 1.5;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 22px;
  overflow-x: auto;
  color: var(--ink);
  margin: 18px 0 0;
}

.solution-list { counter-reset: sol; }
.solution-list li { counter-increment: sol; padding-left: 40px; margin-bottom: 14px; }
.solution-list li::before {
  content: counter(sol, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--muted);
  font-weight: 700;
  letter-spacing: 0.06em;
}

/* ─────────────── viz grid ─────────────── */
.viz-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.viz { margin: 0; }
.viz-frame {
  aspect-ratio: 4 / 3;
  background: repeating-linear-gradient(
    45deg,
    var(--surface),
    var(--surface) 10px,
    var(--surface-2) 10px,
    var(--surface-2) 20px
  );
  border: 1px solid var(--rule);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
  transition: border-color var(--dur-2) var(--ease);
}
.viz-frame:hover { border-color: var(--rule-2); }
.viz.has-img .viz-frame { background: var(--surface); }
.viz.has-img .viz-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--surface-2);
  cursor: zoom-in;
  transition: transform var(--dur-3) var(--ease);
}
.viz.has-img .viz-frame:hover img { transform: scale(1.02); }
.viz-ph {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--soft);
  letter-spacing: 0.04em;
  text-align: center;
  padding: 0 12px;
}
.viz figcaption {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--muted);
  letter-spacing: 0.04em;
  text-align: center;
}

.proj-stack.big .chip { font-size: var(--fs-mono); padding: 7px 12px; }

/* ─────────────── lightbox ─────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(5, 5, 5, 0.94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 80px;
  animation: lb-fade var(--dur-2) var(--ease-out);
}
@keyframes lb-fade { from { opacity: 0; } }

.lb-stage {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.lb-stage img {
  max-width: 100%;
  max-height: calc(100vh - 160px);
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  background: var(--surface);
}
.lb-stage figcaption {
  font-family: var(--mono);
  color: var(--muted);
  font-size: var(--fs-mono);
  letter-spacing: 0.04em;
  text-align: center;
}

.lb-btn {
  position: fixed;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 1.4rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background var(--dur-1) var(--ease), border-color var(--dur-1) var(--ease),
              transform var(--dur-1) var(--ease);
  z-index: 101;
}
.lb-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}
.lb-close { top: 20px; right: 24px; }
.lb-prev { left: 24px; top: 50%; transform: translateY(-50%); }
.lb-prev:hover { transform: translateY(-50%) scale(1.05); }
.lb-next { right: 24px; top: 50%; transform: translateY(-50%); }
.lb-next:hover { transform: translateY(-50%) scale(1.05); }

@media (max-width: 600px) {
  .lightbox { padding: 48px 12px; }
  .lb-btn { width: 38px; height: 38px; font-size: 1.1rem; }
  .lb-close { top: 12px; right: 12px; }
  .lb-prev { left: 8px; }
  .lb-next { right: 8px; }
}

/* ─────────────── pager ─────────────── */
.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 72px;
  padding-top: 36px;
  background-image: linear-gradient(90deg, var(--rule-2) 20%, transparent 80%);
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 1px;
}
.pager a {
  display: block;
  padding: 18px 20px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  text-decoration: none;
  color: var(--ink);
  background: var(--surface);
  transition: border-color var(--dur-2) var(--ease), transform var(--dur-2) var(--ease),
              color var(--dur-2) var(--ease);
}
.pager a:hover { border-color: var(--ink); transform: translateY(-2px); }
.pager .pg-label {
  font-family: var(--mono);
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 6px;
  display: block;
}
.pager .pg-title { font-weight: 600; font-size: 1rem; line-height: 1.3; }
.pager .next { text-align: right; }
.pager .empty { border: 1px dashed var(--rule); border-radius: 8px; }

/* ─────────────── footer ─────────────── */
footer {
  margin-top: 120px;
  padding-top: 32px;
  background-image: linear-gradient(90deg, var(--rule-2) 20%, transparent 80%);
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 1px;
  font-size: var(--fs-mono);
  color: var(--muted);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.footer-col h4 {
  font-family: var(--mono);
  font-size: var(--fs-mono);
  font-weight: 400;
  color: var(--soft);
  letter-spacing: 0.06em;
  margin: 0 0 12px;
  text-transform: lowercase;
}
.footer-col h4::before { content: '> '; color: var(--soft); }

.footer-col ul { list-style: none; padding: 0; margin: 0; }
.footer-col ul li {
  padding: 0;
  margin: 0 0 6px;
  font-family: var(--mono);
  font-size: var(--fs-mono);
  color: var(--muted);
}
.footer-col ul li::before { content: none; }
.footer-col a { color: var(--muted); text-decoration: none; }
.footer-col a:hover { color: var(--ink); }

footer .sig {
  font-family: var(--mono);
  font-size: var(--fs-tiny);
  color: var(--soft);
  margin-top: 24px;
  letter-spacing: 0.06em;
}

@media (max-width: 760px) {
  .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}

/* ─────────────── 404 ─────────────── */
.not-found { text-align: center; padding: 120px 24px; }
.not-found h1 {
  font-size: 5rem;
  margin: 0 0 8px;
  font-weight: 600;
  letter-spacing: -0.04em;
}
.not-found p { color: var(--muted); font-style: italic; margin: 0 0 32px; }

/* ─────────────── skip link ─────────────── */
.skip-link {
  position: absolute;
  top: -100px;
  left: 16px;
  background: var(--ink);
  color: var(--bg);
  padding: 10px 16px;
  border-radius: 4px;
  font-family: var(--mono);
  font-size: var(--fs-mono);
  z-index: 200;
  text-decoration: none;
  transition: top var(--dur-2) var(--ease);
}
.skip-link:focus {
  top: 16px;
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

/* ─────────────── typed ─────────────── */
.typed {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  border-right: 1px solid currentColor;
  width: calc(var(--len, 30) * 1ch);
  animation: typed-in
      calc(var(--len, 30) * var(--type-speed, 45ms))
      steps(40, end)
      var(--type-delay, 200ms)
      1
      backwards,
    typed-blink 0.9s steps(1, end) infinite 1.6s;
}
@keyframes typed-in { from { width: 0; } }
@keyframes typed-blink { 50% { border-color: transparent; } }

/* ─────────────── reveal ─────────────── */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--dur-3) var(--ease-out) var(--reveal-delay, 0ms),
              transform var(--dur-3) var(--ease-out) var(--reveal-delay, 0ms);
}
.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ─────────────── responsive ─────────────── */
@media (max-width: 760px) {
  .topnav ul { gap: 14px; }
  .topnav ul a { font-size: var(--fs-tiny); }
  .projects-grid { grid-template-columns: 1fr; }
  .viz-grid { grid-template-columns: 1fr; }
  main { padding: 56px var(--pad-x) 80px; }
  .topnav-inner { padding: 12px var(--pad-x); }
  header.intro { margin-bottom: 64px; }
  section { margin: 56px 0; }
}

@media (max-width: 480px) {
  body { font-size: 0.95rem; }
  .topnav ul { gap: 10px; }
  .timeline { padding-left: 20px; }
  .entry::before { left: -20px; }
}

/* ─────────────── reduced motion ─────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1; transform: none; }
  .typed {
    width: auto;
    border-right: 0;
    animation: none;
  }
  .cursor-glow { display: none; }
  .hero-rule { transform: none; }
  body::before { display: none; }
}

/* ─────────────── print ─────────────── */
@media print {
  :root {
    --bg: #fff;
    --ink: #000;
    --muted: #444;
    --soft: #666;
    --rule: #ccc;
    --rule-2: #bbb;
    --surface: #fff;
    --surface-2: #f5f5f5;
  }
  body::before, .cursor-glow, .topnav, .skip-link, .theme-btn,
  .filter-bar, .pager, .proj-foot, .proj-cover, .lightbox, footer .sig {
    display: none !important;
  }
  main { max-width: 100%; padding: 0 !important; }
  section, header.intro, .proj-hero { page-break-inside: avoid; }
  a { color: #000 !important; text-decoration: none !important; }
  .projects-grid { grid-template-columns: 1fr; }
  .viz-grid { grid-template-columns: repeat(3, 1fr); }
  body { font-size: 11pt; background: #fff; }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Smoke-check the rendered output**

Run: `npm run dev` then open `http://localhost:3000` in a browser.
Expected: page renders dark, with current markup, no console errors. Some elements (e.g., 3-col footer, status row, now.txt) won't appear yet because their markup isn't added until later tasks — that's fine.

Stop the dev server (Ctrl-C) before continuing.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(styles): rewrite globals.css for Vercel-style dark default + motion primitives"
```

---

## Task 5: Mount `<CursorGlow>` + update metadata in `layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update the file**

Replace the file with:

```tsx
import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import './globals.css';
import CursorGlow from './components/CursorGlow';

const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://anhtuan284.github.io'),
  title: {
    default: 'Tuan Truong Bui Anh',
    template: '%s — Tuan Truong Bui Anh',
  },
  description:
    'Mobile engineer in Ho Chi Minh City. Building Flutter + Firebase at PITEK. Before that, RAG pipelines at Azera. I like picking up the thing I don’t know yet.',
  authors: [{ name: 'Tuan Truong Bui Anh' }],
  openGraph: {
    title: 'Tuan Truong Bui Anh',
    description:
      'Mobile engineer in HCMC. Flutter + Firebase at PITEK. Backend, ML, mobile.',
    url: 'https://anhtuan284.github.io',
    siteName: 'ttba.dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tuan Truong Bui Anh',
    description: 'Mobile engineer in HCMC. Flutter + Firebase at PITEK.',
  },
  robots: { index: true, follow: true },
};

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link
          rel="preload"
          href="/fonts/jbm-nerd-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(layout): mount CursorGlow and refresh metadata for redesign"
```

---

## Task 6: Update `Nav.tsx` — brand, sections, scroll progress

**Files:**
- Modify: `app/components/Nav.tsx`

The current section list `['about', 'skills', 'experience', 'projects', 'education', 'contact']` matches the new section ids — keep it.

- [ ] **Step 1: Replace the file with**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const sections = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [active, setActive] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let resolved: 'light' | 'dark' | null = null;
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') resolved = stored;
    } catch {}
    setTheme(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const els = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isHome]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) {
        progressRef.current.style.setProperty('--scroll', `${pct * 100}%`);
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  const isDark = mounted
    ? theme === 'dark' ||
      (theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
    : true;

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="brand">
          ttba<span className="dot">.</span>dev
        </Link>
        <div className="topnav-right">
          <ul>
            {sections.map((id) => (
              <li key={id}>
                <Link href={`/#${id}`} data-active={isHome && active === id ? 'true' : undefined}>
                  {id}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            aria-pressed={isDark}
            title={mounted ? (isDark ? 'Switch to light' : 'Switch to dark') : 'Toggle theme'}
            suppressHydrationWarning
          >
            <span suppressHydrationWarning>{mounted ? (isDark ? '☼' : '☾') : '☾'}</span>
          </button>
        </div>
        <span ref={progressRef} className="scroll-progress" aria-hidden="true" />
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add app/components/Nav.tsx
git commit -m "feat(nav): rebrand to ttba.dev, add scroll-progress hairline"
```

---

## Task 7: Rebuild home `page.tsx` — hero block + first-person copy

**Files:**
- Modify: `app/page.tsx`

This task rewrites the whole file in one pass — section structure is small, easier to read as a unit.

- [ ] **Step 1: Replace `app/page.tsx` with**

```tsx
import Nav from './components/Nav';
import ProjectsList from './components/ProjectsList';
import Reveal from './components/Reveal';
import Typed from './components/Typed';
import { projects } from './data/projects';

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top">
        <header className="intro">
          <span className="eyebrow">
            <Typed text="▌ MOBILE_ENGINEER · HCMC · OPEN_TO_WORK" />
          </span>

          <h1>
            Tuan
            <br />
            Truong
            <br />
            Bui Anh<span className="dot-grad">.</span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <p className="lede">
            I build mobile apps that ship. Currently shipping Flutter + Firebase at PITEK — before
            that, R&amp;D on RAG pipelines at Azera. I like picking up the thing I don&apos;t know
            yet.
          </p>

          <p className="status-row">
            ▌ now: building PiEx · stack: flutter · firebase · last commit: today
          </p>

          <div className="social-links">
            <a href="https://github.com/anhtuan284" target="_blank" rel="noopener noreferrer">
              github ↗
            </a>
            <a href="https://www.linkedin.com/in/tuantba" target="_blank" rel="noopener noreferrer">
              linkedin ↗
            </a>
            <a href="mailto:dev.atuan03@gmail.com">mail ↗</a>
          </div>
        </header>

        <Reveal as="section" id="about">
          <h2>About</h2>
          <div className="about-grid">
            <p>
              I&apos;m a mobile engineer based in Ho Chi Minh City. I work across the stack when I
              have to — backend, ML pipelines, the occasional cross-platform client — but mobile is
              where I do my best work right now. I treat each new project as the cheapest way to
              learn something I didn&apos;t know last quarter, and I aim for code that ships and
              stays shipped.
            </p>
            <pre className="now-txt" aria-label="current status">
              <span className="now-label">{'> now.txt'}</span>
              <span className="now-rule">──────────────</span>
              <span><span className="now-key">role  ·</span> <span className="now-val">mobile eng @ pitek</span></span>{'\n'}
              <span><span className="now-key">stack ·</span> <span className="now-val">flutter · firebase · dart</span></span>{'\n'}
              <span><span className="now-key">free  ·</span> <span className="now-val">weekends, side contracts</span></span>{'\n'}
              <span><span className="now-key">loc   ·</span> <span className="now-val">district 7, hcmc, vn</span></span>{'\n'}
              <span><span className="now-key">mail  ·</span> <span className="now-val">dev.atuan03@gmail.com</span></span>
            </pre>
          </div>
        </Reveal>

        <Reveal as="section" id="skills">
          <h2>Skills</h2>
          <div className="skill-rows">
            <div className="skill-row">
              <span className="skill-label">lang/</span>
              <div className="skill-chips">
                {['Dart', 'Java', 'SQL', 'Python', 'TypeScript', 'C++'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">mobile/</span>
              <div className="skill-chips">
                {['Flutter', 'Firebase', 'GetX', 'Bloc'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">web/</span>
              <div className="skill-chips">
                {['Spring MVC', 'Flask', 'Django', 'ASP.NET', 'React'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">ml/data/</span>
              <div className="skill-chips">
                {['TensorFlow', 'PyTorch', 'MySQL', 'MSSQL'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">infra/</span>
              <div className="skill-chips">
                {['Docker', 'Linux', 'Git'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="experience">
          <h2>Experience</h2>
          <div className="timeline">
            <div className="entry current">
              <h3>Mobile Engineer — PITEK Joint Stock Company</h3>
              <p className="when">NOV 2025 → NOW</p>
              <p className="where">Bình Thạnh, HCMC · on-site · full-time</p>
              <ul>
                <li>
                  <strong>PiCare</strong> — shipping features across the resident and agent apps;
                  both ends of the property-management flow.
                </li>
                <li>
                  <strong>PiEx</strong> — solo build of the secondary platform that moves
                  real-estate exchange online. Sellers and landlords meet under a monopoly contract
                  so every listing on the exchange is verified and trustworthy.
                </li>
                <li>
                  <strong>PiEx</strong> — built a map view that visualizes house prices by area, so
                  users can read the local market at a glance.
                </li>
                <li>Partnered with the front-end lead to harden parts of the auth flow.</li>
                <li>Stack: Flutter · Firebase · Dart.</li>
              </ul>
            </div>

            <div className="entry">
              <h3>Software Developer — Azera Vietnam</h3>
              <p className="when">AUG 2024 → NOV 2025</p>
              <ul>
                <li>R&amp;D on an ingestion RAG pipeline for asset querying and search completion.</li>
                <li>Shipped new features and maintained the core codebase end-to-end.</li>
                <li>Sat in on market research and contributed to an MVP launch.</li>
                <li>Picked up design patterns and tooling I still use today.</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="projects">
          <h2>Projects</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28, maxWidth: '60ch' }}>
            Things I built — by myself or with small teams. Some shipped, some are still cooking,
            some sit as lessons.
          </p>
          <ProjectsList projects={projects} />
        </Reveal>

        <Reveal as="section" id="education">
          <h2>Education</h2>
          <div className="timeline">
            <div className="entry">
              <h3>B.Sc. Computer Science — Ho Chi Minh City Open University</h3>
              <p className="when">OCT 2021 → NOW</p>
            </div>
            <div className="entry">
              <h3>Big Data Track — Samsung Innovation Campus</h3>
              <p className="when">JUN 2024 → AUG 2024</p>
            </div>
          </div>
        </Reveal>

        <Reveal as="section">
          <h2>Recognition</h2>
          <ul>
            <li>4th Prize, Student Informatics Olympiad 2024 — Open Source Software track.</li>
            <li>
              Consolation Prize, Scientific Research — automated student attendance via cornea
              tracking.
            </li>
          </ul>
        </Reveal>

        <footer id="contact">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>reach</h4>
              <ul>
                <li>
                  <a href="mailto:dev.atuan03@gmail.com">dev.atuan03@gmail.com</a>
                </li>
                <li>(+84) 37 782 2815</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>elsewhere</h4>
              <ul>
                <li>
                  <a href="https://github.com/anhtuan284" target="_blank" rel="noopener noreferrer">
                    github.com/anhtuan284
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/tuantba"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin.com/in/tuantba
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>meta</h4>
              <ul>
                <li>© {new Date().getFullYear()} ttba.dev</li>
                <li>built {new Date().toISOString().slice(0, 10)}</li>
                <li>hcmc · vn</li>
              </ul>
            </div>
          </div>
          <p className="sig">// end of file</p>
        </footer>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: success.

- [ ] **Step 3: Smoke-check**

Run: `npm run dev` and open `http://localhost:3000`.
Expected: dark page; oversized stacked name; typed eyebrow; mono status row; new about + now.txt block; skills as labeled chip rows; experience timeline with pulsing PITEK dot; projects grid; 3-col footer. Stop dev server when done.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): rebuild page markup, copy, and reveal-wrapped sections"
```

---

## Task 8: Update `ProjectsList.tsx` — status pill dot variants

**Files:**
- Modify: `app/components/ProjectsList.tsx`

The CSS supports `data-variant="live|wip|archived"` on `.proj-status`. Map project statuses to those variants.

- [ ] **Step 1: Replace `ProjectsList.tsx` with**

```tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Project } from '../data/projects';

const FILTERS = ['All', 'Production', 'Research', 'Award', 'Archived'] as const;
type Filter = (typeof FILTERS)[number];

function statusVariant(status: Project['status']): 'live' | 'wip' | 'archived' | undefined {
  if (status === 'Production' || status === 'Award') return 'live';
  if (status === 'Research' || status === 'Prototype') return 'wip';
  if (status === 'Archived' || status === 'Private') return 'archived';
  return undefined;
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.status === filter)),
    [projects, filter]
  );

  return (
    <>
      <div className="filter-bar" role="tablist" aria-label="Filter projects by status">
        {FILTERS.map((f) => {
          const count =
            f === 'All' ? projects.length : projects.filter((p) => p.status === f).length;
          if (f !== 'All' && count === 0) return null;
          return (
            <button
              key={f}
              type="button"
              className="filter-btn"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f} <span style={{ opacity: 0.6 }}>· {count}</span>
            </button>
          );
        })}
      </div>

      <div className="projects-grid">
        {filtered.map((p) => (
          <article key={p.slug} className="proj">
            {p.cover ? (
              <Link href={`/projects/${p.slug}/`} className="proj-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.title} loading="lazy" />
              </Link>
            ) : (
              <Link href={`/projects/${p.slug}/`} className="proj-cover empty">
                <span className="proj-cover-ph">{p.title}</span>
              </Link>
            )}
            <div className="proj-head">
              <div className="proj-head-text">
                <p className="proj-year">{p.year}</p>
                <h3 className="proj-title">
                  <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
                </h3>
              </div>
              <span className="proj-status" data-variant={statusVariant(p.status)}>
                {p.status}
              </span>
            </div>
            <p className="proj-blurb">{p.tagline}</p>
            <div className="proj-stack">
              {p.stack.slice(0, 6).map((s) => (
                <span key={s.label} className="chip">
                  {s.ico ? <span className="ico">{s.ico}</span> : null}
                  {s.label}
                </span>
              ))}
              {p.stack.length > 6 ? (
                <span className="chip more">+{p.stack.length - 6}</span>
              ) : null}
            </div>
            <div className="proj-foot">
              <Link href={`/projects/${p.slug}/`}>{'→ '}case study</Link>
              {p.repo ? (
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  ↗ repo
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add app/components/ProjectsList.tsx
git commit -m "feat(projects): map status to colored-dot pill variants"
```

---

## Task 9: Restyle project detail page

**Files:**
- Modify: `app/projects/[slug]/page.tsx`

Only the header (crumb + hero) restructures; sections below keep their existing class hooks and pick up the new CSS automatically.

- [ ] **Step 1: Replace the file with**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '../../components/Nav';
import Pager from '../../components/Pager';
import VizGrid from '../../components/VizGrid';
import { getProject, projects } from '../../data/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — Tuan Truong Bui Anh`,
    description: p.tagline,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <>
      <Nav />
      <main id="top">
        <p className="crumb">
          <Link href="/#projects">← work</Link> / {p.slug}
        </p>

        <header className="proj-hero">
          <p className="eyebrow">
            {p.status} · {p.year}
            {p.role ? ` · ${p.role}` : ''}
          </p>
          <h1>{p.title}</h1>
          <p className="tagline">
            <em>{p.tagline}</em>
          </p>
          {p.team ? <p className="team-line">{p.team}</p> : null}
          <div className="proj-hero-foot">
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="ext">
                ↗ view repository
              </a>
            ) : (
              <span className="ext-disabled">// internal project — no public repo</span>
            )}
            {p.extraLinks?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ext"
              >
                ↗ {l.label}
              </a>
            ))}
          </div>
        </header>

        <section>
          <h2>Overview</h2>
          <p>{p.overview}</p>
          {p.highlights ? (
            <ul className="highlights">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section>
          <h2>Architecture</h2>
          <p>{p.architecture.description}</p>
          <pre className="diagram" aria-label="architecture diagram">
            {p.architecture.diagram}
          </pre>
        </section>

        <section>
          <h2>Solution</h2>
          <ul className="solution-list">
            {p.solution.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Visualization</h2>
          <VizGrid items={p.visualization} />
        </section>

        <section>
          <h2>Tech Stack</h2>
          <div className="proj-stack big">
            {p.stack.map((s) => (
              <span key={s.label} className="chip">
                {s.ico ? <span className="ico">{s.ico}</span> : null}
                {s.label}
              </span>
            ))}
          </div>
        </section>

        <Pager slug={p.slug} />

        <footer>
          <div className="footer-grid">
            <div className="footer-col">
              <h4>navigate</h4>
              <ul>
                <li>
                  <Link href="/#projects">← back to projects</Link>
                </li>
                <li>
                  <Link href="/">home</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>elsewhere</h4>
              <ul>
                {p.repo ? (
                  <li>
                    <a href={p.repo} target="_blank" rel="noopener noreferrer">
                      repo ↗
                    </a>
                  </li>
                ) : null}
                <li>
                  <a href="mailto:dev.atuan03@gmail.com">mail ↗</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>meta</h4>
              <ul>
                <li>© {new Date().getFullYear()} ttba.dev</li>
                <li>{p.year}</li>
              </ul>
            </div>
          </div>
          <p className="sig">// end of case study</p>
        </footer>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: success.

- [ ] **Step 3: Smoke-check**

Run: `npm run dev`, open `http://localhost:3000/projects/moodloom/`.
Expected: new crumb, large project name, gradient hairline under hero, sections render, lightbox still works on Visualization images, footer is 3-col. Stop dev server when done.

- [ ] **Step 4: Commit**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat(project-detail): restyle hero + 3-col footer for redesign"
```

---

## Task 10: Final verification pass

This task has no code — it's the manual checklist that proves the redesign holds together.

**Files:** none modified.

- [ ] **Step 1: Build and start the dev server**

Run: `npm run build && npm run dev`
Expected: build succeeds; dev server starts at `http://localhost:3000`.

- [ ] **Step 2: Visual check at three viewport widths**

Use Chrome DevTools device toolbar.

1. `≥1080px` (laptop) — verify hero, `now.txt` aside visible, 2-up projects grid, 3-col footer, cursor glow visible on mouse move.
2. `760px` (tablet) — verify hero scales, `now.txt` stacks under About, 1-up projects, 2-col footer.
3. `380px` (phone) — verify single-col everywhere, nav wraps gracefully, no horizontal scroll. Cursor glow not visible (touch).

Expected: no overflow at any width; nav remains usable; no overlapping text.

- [ ] **Step 3: Theme toggle**

Click the moon icon top-right. Page flips to light tokens. Click again — back to dark. Reload — preference persists.

Expected: contrast remains readable both modes; cursor glow color adapts.

- [ ] **Step 4: Reduced motion**

In DevTools: Rendering panel → "Emulate CSS media feature prefers-reduced-motion" → `reduce`.

Expected: typed eyebrow renders instantly with no caret; hero gradient rule appears with no animation; section reveals render in-place; cursor glow hidden; spinning project border idle.

- [ ] **Step 5: Keyboard navigation**

Tab through the page from top.

Expected: visible focus rings on nav links, theme button, social links, project links, footer links. Skip link appears in top-left on first Tab.

- [ ] **Step 6: Project detail walkthrough**

Open `http://localhost:3000/projects/cxr-multi-disease/`.

Expected: crumb, oversized project title, restyled diagram block, viz grid lightbox works (click image → opens; ←/→ steps; Esc closes), pager at bottom, 3-col footer.

- [ ] **Step 7: Console / Lighthouse**

Open DevTools Console — should be empty (no warnings, no errors).
Open DevTools Lighthouse → run a desktop audit on home page.

Expected: Performance, Accessibility, Best Practices, SEO each ≥95.

- [ ] **Step 8: Commit any tweaks**

If any defects were fixed during verification, commit them separately. If everything passed, no commit needed for this task.

```bash
# Only if fixes were made
git add -A
git commit -m "fix(redesign): post-verification adjustments"
```

- [ ] **Step 9: Stop the dev server**

Ctrl-C in the terminal running `npm run dev`.

---

## Self-Review Summary

- **Spec coverage:** every section in the design spec maps to at least one task (tokens → T4; Reveal/CursorGlow/Typed → T1/T2/T3; layout mount → T5; nav scroll progress → T6; hero/about/skills/experience/projects/education/recognition/footer → T7; status pills → T8; project detail → T9; responsive + a11y verification → T10).
- **Placeholders:** none. All code blocks are complete drop-in replacements.
- **Type consistency:** `Reveal` accepts `as`, `children`, `className`, `id`, `delay` — referenced consistently in `page.tsx` (T7). `Typed` accepts `text`, `speed`, `delay`, `className` — referenced consistently in `page.tsx` (T7).
- **Order risk:** `Reveal`/`CursorGlow`/`Typed` must exist before `page.tsx` (T7) and `layout.tsx` (T5) import them — T1–T3 precede T5/T7.
- **CSS coverage:** every class name used in markup (status-row, hero-rule, dot-grad, about-grid, now-txt, skill-rows, skill-row, skill-label, skill-chips, timeline, entry.current, footer-grid, footer-col, scroll-progress, cursor-glow, reveal, typed) is defined in T4's globals.css.
