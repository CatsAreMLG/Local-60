<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# IBEW Local 60 — Endorsements Site

A single-page endorsement showcase for the 2026 general election. Content is managed in Sanity CMS; the site is statically rendered with ISR.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Bundler | **Turbopack** (default in this version — no `--webpack` flag needed) |
| Language | TypeScript 5 |
| Styling | CSS Modules (`page.module.css`) + Tailwind v4 for globals |
| CMS | Sanity (`next-sanity` 12, GROQ queries) |
| Fonts | `next/font/google` — self-hosted at build time |

## Key Next.js version notes

- Turbopack is the **default bundler** (`next dev` uses it automatically)
- `next/font/google` export names differ from older versions — always verify against `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts` before using a font
- `axes` on a Google font requires `weight` to be omitted or `"variable"` (not an array of weights)
- The `turbopack` config key replaces `experimental.turbo` (the old key is removed in v16)

## File structure

```
app/
  layout.tsx              # Root layout — fonts, metadata
  page.tsx                # Home page — async server component, fetches all Sanity data
  page.module.css         # All page styles (shared by client components too)
  globals.css             # CSS variables, base resets, Tailwind import
  EndorsementsSection.tsx # "use client" — filter chips, card grid, detail panel
  FaqSection.tsx          # "use client" — FAQ accordion
sanity/
  client.ts               # Sanity client (useCdn: true, perspective: "published")
next.config.ts            # Minimal — no custom config yet
public/
  logo_sm.png             # IBEW Local 60 logo (used in header + footer)
```

## Sanity data & caching

All fetches live in `app/page.tsx` using `Promise.all`. Revalidation strategy:

| Data | Query constant | Revalidate |
|---|---|---|
| Hero text | `HERO_QUERY` | 24 h |
| Process text | `PROCESS_QUERY` | 24 h |
| Process steps | `PROCESS_STEPS_QUERY` | 24 h |
| Criteria | `CRITERIA_QUERY` | 24 h |
| Labels (tier filters) | `LABEL_QUERY` | 24 h |
| FAQs | `FAQ_QUERY` | 24 h |
| Footer text | `FOOTER_QUERY` | 24 h |
| Endorsements | `ENDORSEMENT_QUERY` | 1 h |

The endorsement GROQ query uses reference dereferencing (`tier[0]->`, `positions[]->`). Results are passed as props to `EndorsementsSection` and `FaqSection`.

## Fonts

Loaded via `next/font/google` CSS variables injected on `<body>`:

| Variable | Font | Usage |
|---|---|---|
| `--display` | `Big_Shoulders` (600/700/800) | Headlines |
| `--serif` | `Newsreader` (variable + opsz) | Body copy italics |
| `--sans` | `Public_Sans` (400/500/600/700) | UI / body default |

Font CSS variables are set by the className on `<body>`; `globals.css` and `page.module.css` consume them via `var(--display)` etc.

## CSS conventions

- All component styles in `app/page.module.css` — no separate module files per component
- Color palette via CSS custom properties in `globals.css` (`:root`)
- Tailwind v4 imported via `@import "tailwindcss"` in `globals.css` — no `tailwind.config.js` needed
- Responsive breakpoint: `max-width: 880px`

## Accessibility

- Page uses semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav aria-label="Main navigation">`
- Every `<section>` has `aria-labelledby` pointing to its heading `id`
- Header logo (`/public/logo_sm.png`) has `priority` prop on `<Image>` for LCP

## Environment variables

Defined in `.env` (not `.env.local`):

- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `SANITY_API_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` / `SANITY_API_DATASET`
- `SANITY_API_READ_TOKEN` / `SANITY_API_WRITE_TOKEN`

The Sanity client in `sanity/client.ts` hardcodes the project ID and dataset directly (no env var lookup) — change there if the dataset changes.
