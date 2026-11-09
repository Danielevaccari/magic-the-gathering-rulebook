# Magic: The Gathering Rulebook

Searchable viewer for the Magic: The Gathering Comprehensive Rules. Next.js 16 (App Router) + React 19. Every chapter is prerendered as static HTML; search runs client-side over a static JSON index.

## Commands

- `npm run dev` - dev server (runs `predev` first)
- `npm run build` / `npm start` - production build and serve (`prebuild` runs first)
- `npm run rules` - download and parse the rules only
- `npm run lint` - ESLint (flat config, `eslint-config-next`)
- `npm test` - Vitest (parser and link detection)

## How data flows

1. `scripts/build-rules.mjs` downloads the rules `.txt` from `RULES_URL` (edit it when Wizards publishes a new version; `RULES_URL` env var overrides). If the download fails and output already exists, the old output is kept.
2. `lib/parse-rules.mjs` parses it into sections, chapters and rules (with examples). It throws if the format looks wrong (fewer than 1000 rules, missing markers).
3. Output: `data/rules.json` (read by server components via `lib/data.js`) and `public/search.json` (fetched by the browser the first time search is focused). Both are generated and gitignored.

## Structure

- `app/layout.js` - wraps everything in the client `Shell`. `app/page.js` is the landing page, `app/[chapter]/page.js` is statically generated per chapter id (`dynamicParams = false`).
- `components/Shell.jsx` - client component: glass header, search box and state, chapter sidebar (drawer on mobile), keyboard shortcuts (`/`, `Esc`).
- `components/ChapterView.jsx`, `RuleText.jsx` - server components rendering a chapter; rule references become `next/link` links via `lib/linkify.js`.
- `components/SearchResults.jsx` - filters the index (all terms must match), highlights matches, caps at 100 results.
- `app/globals.css` - all styling (glass panels, responsive layout). Plain CSS, no UI library.

## Conventions and gotchas

- Rule ids look like `702.19b`; chapter ids are the first 3 digits. Each rule is an element with `id` = rule id, so `/702#702.19b` deep-links and is highlighted with `:target`.
- Only rule references that exist in the data are linked; bare 3-digit numbers link only after "rule(s)", "section" or "chapter".
- `content-visibility: auto` on `.rule` keeps long chapters (e.g. 702) cheap to render. Keep `backdrop-filter` off per-rule elements.
- The glossary is not included, only numbered rules.

## Working rules

- Commit messages and PRs: no Claude/AI attribution or co-author trailers.
