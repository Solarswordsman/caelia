---
name: journal-entry
description: Add a new entry to Caelia's in-character journal. Processes [[...]] Diabolic markers (reusing or coining phrases in the shared lexicon), inserts the entry into public/data/entries.json in chronological order, and verifies integrity. Use whenever the user wants to add, write, or record a journal entry for Caelia.
---

# Add a journal entry

Drives the full add-entry workflow for Caelia's journal. The user provides entry prose (usually
with `[[english intent]]` markers for Diabolic phrases), ideally a Golarion date, and optionally a
title. The two sources of truth you edit:

- `public/data/entries.json` — journal entries, oldest first.
- `public/data/diabolic-lexicon.json` — the single canonical Diabolic lexicon.

`CLAUDE.md` has the full lexicon schema, the register/vibe lists, the language-design rules for
coining, and notes on Caelia's voice — **read it and follow it**. Never start a second phrase list.

## Steps

1. **Get the entry text.** If the skill was invoked without it, ask the user to paste it.

2. **Date.** Entries need a Golarion date like `6th of Rova, 4725 AR`. If it's missing, **ask** —
   don't invent one. Months, in order: Abadius, Calistril, Pharast, Gozran, Desnus, Sarenith,
   Erastus, Arodus, Rova, Lamashan, Neth, Kuthona. Current campaign year: 4725 AR.

3. **Title (optional).** If the user gave a title, use it. Otherwise you may propose a short,
   in-voice one (≤ ~6 words) and let them accept or decline. If declined or none, omit the field —
   the journal falls back to showing the date as the heading.

4. **Resolve each `[[...]]` marker** (read `diabolic-lexicon.json` first; don't rely on memory):
   - Search for a match or close-enough equivalent. **Matching is fuzzy — the meaning can stretch.**
     Reuse an existing phrase whenever one reasonably fits.
   - If nothing fits, **coin** a new phrase per the design rules in `CLAUDE.md`: choose a register
     (guttural / liturgical / street / cold) + vibe, give it a canonical `diabolic` form and 1–2
     `alts`, set `coined: true` and `firstAppeared: <this entry's date>`, and append it to the
     lexicon.
   - Replace the `[[...]]` in the text with `{d:DiabolicText:English meaning}`.

5. **Write the entry** to `entries.json` as `{ "date", "title"?, "text" }`, inserted in the correct
   chronological position (oldest first — usually the end). Newlines in `text` use `\n`. Keep
   Caelia's voice; don't polish it (short sentences trailing off, run-ons, CAPS for emphasis, abrupt
   endings — see `CLAUDE.md`).

6. **Verify:** run `npm test`. The lexicon-integrity check confirms the JSON is well-formed and that
   every phrase used in an entry exists in the lexicon. Fix anything it flags.

7. **Report** what you reused vs. coined (quote any new phrases + their meaning), then ask whether to
   commit & push — **don't commit unless asked.**
