# Caelia — project guide for Claude Code

A small static site (Vite, multi-page, **vanilla JS — no framework**) collecting roleplaying
tools and reference material for **Caelia**, a Pathfinder 2e character. Deploys to Netlify at
`caelia.jlamb.sh`. Designed to grow: drop in more small "tools" as separate pages over time.

## Apps

| Page | URL | What it is |
|---|---|---|
| Hub | `/` | Landing page listing the tools. Add a card in `index.html` + a tab in `src/shared/nav.js` for each new tool. |
| Journal | `/journal/` | Caelia's in-character campaign log. Renders `public/data/entries.json`. |
| Diabolic | `/diabolic/` | Reference for her Diabolic language. Renders `public/data/diabolic-lexicon.json`, grouped by vibe. |

## Sources of truth (edit these to add content)

- **`public/data/diabolic-lexicon.json`** — the single, canonical list of all Diabolic phrases.
  Never reintroduce a second phrase list anywhere.
- **`public/data/entries.json`** — all journal entries, chronological (oldest first).

Both are plain JSON fetched at runtime, decoupled from code. Edit → commit → push → Netlify
redeploys. The `npm test` lexicon-integrity check (and the Netlify build) will fail if a phrase
used in an entry is missing from the lexicon, or if the lexicon has bad/duplicate data.

## Character context

Caelia is a fighter-type raised by Asmodeus-worshipping nuns; she escaped as a young adult.
Bilingual in Common and **Diabolic** (a corrupted, Latin-esque infernal tongue). Diabolic slips
out when she's frustrated or emotional. Low intellect, high wisdom/charisma. Campaign is on
Golarion, current year **4725 AR**; Hellknights & Cheliax politics are a running thread. Party:
**Leofric** (smart, she finds him annoying, trusts him), **Malgrin** & **Ophira** (in ongoing
conflict), NPC contact **Ildris**. Pathfinder months: Abadius, Calistril, Pharast, Gozran,
Desnus, Sarenith, Erastus, Arodus, Rova, Lamashan, Neth, Kuthona.

## Diabolic lexicon schema

```json
{
  "diabolic": "Us'maldra!",                  // canonical phrase (the unique key)
  "english": "Damn it!",                      // translation
  "alts": ["Usmaldra!", "Us'mal!"],           // more corrupted/hurried forms ([] if none)
  "register": "guttural",                     // guttural | liturgical | street | cold
  "vibe": "Expletives & frustration",         // one of the 9 sections (see below)
  "usage": "general frustration",             // short usage note (shown on the reference page)
  "notes": "Sharp reflex expletive; ...",     // longer notes / etymology / provenance
  "coined": false,                            // true if invented during play
  "firstAppeared": null                       // e.g. "6th of Rova, 4725 AR" when coined/first written
}
```

**Vibes** (reference-page sections, in order): Expletives & frustration · Dread & dark omens ·
Warding & liturgy · Combat taunts · Trash talk & mid-fight · Ally praise · Casual filler ·
Awe & fearful wonder · Warmth & friendship.

**Registers** (how she speaks it): **guttural** (reflex expletives, hard sounds, apostrophe
contractions) · **liturgical** (nun-taught, fuller Latin-ish structure) · **street** (clipped,
practical, half-remembered) · **cold** (formal register weaponized — precise, controlled, used in
threats and deadly-serious moments).

### Language design rules (when coining)

Diabolic is **not real Latin** — constructed to *feel* Latin-esque but wrong:
1. **Syllable swallowing** — apostrophes mark dropped sounds (`Ven'ad me` from `Veni ad me`).
2. **Consonant hardening** — soft sounds clip/harden (`c` → `k`).
3. **Run-together slurring** under emotion (`Nofugis`, `Yamfinit`).
4. **Liturgical preservation** — nun-taught phrases stay more formal/complete.
5. **Trailing off** — awe/dread phrases break off mid-syntax (`Vah... vastum.`).

Give each new phrase a canonical `diabolic` form and 1–2 `alts` (more corrupted deliveries).

## Workflow: adding a journal entry

The user writes an entry in chat and marks intended Diabolic phrases with **double brackets**:
`[[english phrase or intent]]`. They should include a Golarion date — **ask if missing**.

For each `[[...]]` marker:
1. Search `diabolic-lexicon.json` for a match or close-enough equivalent. **Matching can be fuzzy
   / the meaning can stretch** — reuse an existing phrase whenever one reasonably fits.
2. **If found** → use that phrase.
3. **If not found** → coin a new one in the appropriate register + vibe (follow the design rules),
   give it `alts`, set `coined: true` and `firstAppeared: <entry date>`, and **append it to the
   lexicon**. Note in your reply that you coined it.
4. Replace the `[[...]]` in the entry text with `{d:DiabolicText:English meaning}` (the journal
   renders this as crimson italic with a hover tooltip).

Then append the entry object to `entries.json` in chronological position and (when the user asks)
commit + push. Entries keep their phrases inline and self-contained; the only invariant is that
every phrase used also exists in the lexicon.

### Caelia's voice

Short sentences trailing off with `...`; mid-thought interruptions and run-ons; CAPITALS for
emphasis; honest emotional processing but not self-aware about it; abrupt topic changes
(especially at the end of entries); minimal punctuation polish — she's not a writer.

### Entry format (`entries.json`)

```json
{ "date": "6th of Rova, 4725 AR", "text": "Entry text. {d:Rogus et cinera.:Pyre and ash} ..." }
```

Newlines within `text` use `\n`.

## Conventions & commands

- **Vanilla only** for now (a Vue refactor may come later — out of scope). No React/Tailwind.
- House style: **tabs**, LF, final newline (`.editorconfig`); ESLint flat config (`@stylistic`).
- Shared design tokens live in `src/shared/tokens.css`; the shared nav in `src/shared/nav.js`.
- Runtime-fetched data must live in `public/` (served at `/data/...`).

```bash
npm install
npm run dev       # local dev server (fetch needs a server — don't open files via file://)
npm run lint
npm test          # parser + lexicon-integrity checks
npm run build && npm run preview
```

Deploy: push to `main` → Netlify runs `npm run lint && npm test && npm run build` and publishes
`dist/`. Custom domain `caelia.jlamb.sh` is configured in the Netlify dashboard (DNS handled by the
user).
