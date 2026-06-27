# Diabolic Phrase Reference — Project Context

## What this is

A quick-reference page for a Pathfinder 2E character's constructed language: **Diabolic**, a corrupted Latin-esque tongue she picked up from Asmodeus-worshipping nuns as a child. She ran away, but the language stuck — half liturgy, half profanity, all complicated.

The artifact is a **single-page static HTML file** with no dependencies beyond Google Fonts. No build step required. Deployable to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

---

## Character background (relevant to phrase design)

- Fighter/warrior type, high wisdom and charisma, low intellect
- Raised by nuns in an Asmodean convent; escaped as a young adult
- Speaks Common and Diabolic — bilingual but Diabolic is deeply emotional, not intellectual
- Key character tic: **she switches mid-sentence**, usually dropping into Diabolic for the actual curse or reaction, then back to Common
- She doesn't always know what her phrases mean — many are muscle memory from chapel and punishment

---

## Language design rules

Diabolic is **not real Latin** — it's constructed to *feel* Latin-esque but wrong. Rules:

1. **Syllable swallowing**: apostrophes mark dropped sounds (e.g. `Ven'ad me` instead of `Veni ad me`). She half-remembers things.
2. **Consonant hardening**: soft Latin sounds get clipped or hardened (`c` → `k`, etc.)
3. **Run-together slurring**: words collapse under emotion (`Nofugis`, `Yamfinit`, `Inignom`)
4. **Liturgical preservation**: Set 2 phrases (nun-taught) stay more formal and complete — those were drilled in
5. **Trailing off**: awe/wonder phrases especially break off mid-syntax

Each phrase has a **canonical form** and 1–2 **alternates** representing more corrupted/hurried deliveries.

---

## Data structure

Phrases are organized into **vibes** (not grammatical categories). Each section has:

```js
{
  vibe: "Section name",       // filter label
  sub: "Short description",   // italicized sub-label
  entries: [
    {
      meaning: '"Translation." — usage note',  // quote before em-dash, note after
      main: "Canonical phrase",
      alts: "Alt one / Alt two"               // " / " separated; "—" if none
    }
  ]
}
```

### Current vibes (in order)
1. **Expletives & frustration** — reflex curses, things slipping out
2. **Dread & dark omens** — quiet, cold, foreboding
3. **Warding & liturgy** — childhood programming cracking through
4. **Combat taunts** — deliberate, blood is up
5. **Trash talk & mid-fight** — muttered, contemptuous
6. **Ally praise** — when someone lands a good hit
7. **Casual filler** — slips out without thinking
8. **Awe & fearful wonder** — when something is too big for normal words
9. **Warmth & friendship** — genuine, though she'd never admit it

---

## UI design notes

- **Dark infernal theme**: deep near-black background (`#0e0b08`), gold accents (`#c9a84c`), warm parchment text (`#d4c4a0`)
- **Fonts**: Cinzel (headers/labels, serif all-caps) + Crimson Text (body/phrases, elegant serif)
- **Layout**: two-column grid per entry — **Meaning/usage on the left**, **Phrase + alternates on the right**
- **Usage notes** are visually de-emphasized (italic, faint) vs. the translation quote
- **Alternates** are same visual weight as the main phrase but dimmer gold (`#b89a5a`), separated by a `◆` glyph
- **Filter pills** at top jump to a single vibe section; "All" shows everything
- Fade-in animation on section render

---

## Planned expansion

This page is intended to live alongside a **character journal** (separate artifact/page) in the same repo. Both are reference tools for the same Pathfinder character. Future ideas:

- Shared design tokens / CSS variables between pages
- A simple nav or landing page linking both tools
- Possibly a `data/` folder with phrases as JSON, imported by the HTML (better for editing)
- Print stylesheet for table use
- More vibe categories as gameplay develops

---

## Suggested repo structure

```
/
├── index.html              # landing page or redirect
├── diabolic-phrases/
│   └── index.html          # this artifact
├── journal/
│   └── index.html          # character journal artifact (separate chat)
├── shared/
│   └── tokens.css          # shared design tokens (future)
└── CONTEXT.md              # this file (or move to /diabolic-phrases/)
```

---

## How to add new phrases

1. Find the right `vibe` block in the `data` array (or add a new one)
2. Add an entry object following the structure above
3. The `meaning` field: put the translation in quotes before ` — `, usage note after
4. For `alts`: use ` / ` as separator, or `"—"` for none
5. The filter pill for any new vibe generates automatically

When asking Claude to generate new phrases, give it:
- The **emotional register** (e.g. "something between contempt and pity")
- Any **situational context** (e.g. "directed at an enemy who just surprised her")
- Whether it should be **liturgical/formal** or **corrupted/street-level**
- Whether to skew **weirder** (more broken syntax, more syllable collapse)