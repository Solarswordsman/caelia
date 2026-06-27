# Caelia

A small collection of roleplaying tools & reference apps for **Caelia**, a Pathfinder 2e
character. Static site built with Vite (multi-page, vanilla JS), deployed to Netlify at
[caelia.jlamb.sh](https://caelia.jlamb.sh).

## Apps

- **Hub** (`/`) — landing page linking the tools.
- **Journal** (`/journal/`) — Caelia's in-character campaign log, with inline Diabolic phrases
  that show their translation on hover.
- **Diabolic Phrases** (`/diabolic/`) — the full lexicon of her corrupted infernal tongue, sorted
  by "vibe".

## Data

Two plain JSON files in `public/data/` are the sources of truth, fetched at runtime:

- `diabolic-lexicon.json` — the single canonical list of all Diabolic phrases.
- `entries.json` — all journal entries.

New journal entries and phrases are added by editing these files (typically by chatting with
Claude Code — see [CLAUDE.md](CLAUDE.md) for the workflow), then committing.

## Develop

```bash
npm install
npm run dev                  # http://localhost:5173
npm run lint
npm test                     # parser + lexicon-integrity checks
npm run build && npm run preview
```

> Pages fetch their JSON, so use the dev server / preview rather than opening the HTML via
> `file://`.

## Deploy

Push to `main`. Netlify runs `npm run lint && npm test && npm run build` and publishes `dist/`.
See [netlify.toml](netlify.toml).

## Project layout

```
caelia/
├── index.html · journal/index.html · diabolic/index.html   # page entry points
├── src/
│   ├── shared/    # tokens.css, nav (css/js), dom helpers — the shared base
│   ├── hub/ · journal/ · diabolic/                          # per-app css + js
│   └── test/                                                # vitest specs
├── public/data/   # entries.json, diabolic-lexicon.json (sources of truth)
└── netlify.toml · vite.config.js · eslint.config.js · CLAUDE.md
```
