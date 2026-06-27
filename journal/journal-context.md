# Caelia's Journal — Project Guide for Claude Code

## What This Is

An in-character journal for **Caelia**, a player character in an ongoing Pathfinder 2e campaign. It's a static web app: a single HTML page that loads entries from `data/entries.json` and renders them in a handwritten journal aesthetic. Diabolic phrases are embedded in entries and rendered with a distinctive style and hover tooltip.

This project lives alongside a **Diabolic Phrase Lexicon** (`data/diabolic-lexicon.json`), which tracks the full vocabulary of Caelia's second language. Both files should be kept in sync when new phrases are coined.

---

## Character Context

Caelia is a fighter-type character, raised by Asmodeus-worshipping nuns. She grew up bilingual in Common and Diabolic — a Latin-esque infernal language with guttural contracted sounds. She's not a natural writer; her entries are candid, mid-thought, emotionally honest without being self-aware about it. Diabolic phrases slip out when she's frustrated or emotional, the way a bilingual person defaults to their first language under stress.

**Current party:**
- **Leofric** — smarter than her, she finds him annoying, probably trusts him
- **Malgrin** — party member, in ongoing conflict with Ophira
- **Ophira** — party member, privileged background; Caelia has had meaningful conversations with her
- **Ildris** — NPC contact

**Campaign setting:** Golarion. Current year: **4725 AR**. The Hellknights and Cheliax politics are a running thread. The Pathfinder calendar months are: Abadius, Calistril, Pharast, Gozran, Desnus, Sarenith, Erastus, Arodus, Rova, Lamashan, Neth, Kuthona.

---

## Project Structure

```
caelia-journal/
├── CLAUDE.md                   ← this file
├── README.md                   ← human-readable overview (optional)
├── index.html                  ← the journal (CSS and JS can be split out)
├── style.css                   ← (optional: extracted from index.html)
├── main.js                     ← (optional: extracted from index.html)
├── data/
│   ├── entries.json            ← all journal entries (source of truth)
│   └── diabolic-lexicon.json   ← all known Diabolic phrases (source of truth)
└── .gitignore
```

---

## Diabolic Phrase System

### Language registers

Diabolic developed across four registers Caelia uses instinctively:

| Register | Characteristics | Examples |
|---|---|---|
| **Guttural** | Reflex expletives; apostrophe contractions; hard sounds | `Us'maldra!`, `Nox erebi!` |
| **Liturgical** | Nun-taught formal phrases; full Latin-ish structure | `Rogus et cinera.`, `Inferis da mihi patientiam` |
| **Street** | Clipped, practical, half-remembered | `Mer'cinis!`, `In ignem omnia` |
| **Cold/Threatening** | Formal register turned weaponized; precise, controlled | `Satis est.`, `Iam videt.` |

New coined phrases should fit one of these registers. The full vocabulary lives in `data/diabolic-lexicon.json`.

### In-entry storage format

```
{d:DiabolicText:English meaning}
```

Example: `{d:Rogus et cinera.:Pyre and ash}`

The journal renders these as crimson italic text with a hover tooltip showing the English.

### User input format (in chat)

When adding a new entry, the user signals Diabolic phrases with double brackets:

```
[[english phrase or intent]]
```

**Workflow for handling these:**
1. Search `data/diabolic-lexicon.json` for a match or close equivalent
2. If found → use the established phrase
3. If not found → coin a new one consistent with the appropriate register, note it in your response, and add it to the lexicon
4. Replace `[[...]]` in the entry text with `{d:DiabolicText:English meaning}`

---

## Adding a New Entry

1. User provides entry text in chat (with `[[phrase]]` markers and a Pathfinder date)
2. Process phrases → look up or coin, replace markers
3. Append the new entry object to `data/entries.json`
4. If new phrases were coined, add them to `data/diabolic-lexicon.json`
5. Commit and push → site redeploys automatically (if CI is set up)

If the user forgets to include a date, ask for it.

### Entry format in entries.json

```json
{
  "date": "6th of Rova, 4725 AR",
  "text": "Entry text here. {d:DiabolicText:English meaning} more text."
}
```

Entries are ordered chronologically (oldest first). Newlines within text use `\n`.

### Preserving Caelia's voice

- Short sentences, trailing off with `...`
- Mid-thought interruptions and run-ons
- Capitalised words for emphasis (`WORKING`, `AGAIN`)
- Honest emotional processing, but not self-aware about it
- Abrupt topic changes — especially at the end of entries
- Minimal punctuation polish; she's not a writer

---

## Deployment

The site is fully static — no build step needed.

**Local preview** (required if using `fetch()` for entries.json):
```bash
python -m http.server 8080
# then open http://localhost:8080
```

**GitHub Pages:**
- Push to `main`, enable Pages in repo settings (serve from root)

**Netlify:**
- Connect repo or drag-and-drop the folder; auto-deploys on push

---

## Notes for Claude Code

- `data/entries.json` and `data/diabolic-lexicon.json` are the sources of truth — prefer editing these over touching `index.html`
- The CSS and JS can be split out of `index.html` into `style.css` / `main.js` if the file gets unwieldy
- The journal's visual identity: cheap ruled paper, handwriting font (Kalam), Crimson Pro for dates and labels, dark parchment background — keep changes consistent with this aesthetic
- The Diabolic lexicon and the journal are sibling projects; if there's a companion repo or document for the lexicon, cross-reference it here