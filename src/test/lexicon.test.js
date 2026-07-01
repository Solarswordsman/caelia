import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (p) => JSON.parse(readFileSync(root + p, "utf8"));

const lexicon = read("public/data/diabolic-lexicon.json");
const entries = read("public/data/entries.json");

const VIBES = new Set([
	"Expletives & frustration",
	"Dread & dark omens",
	"Warding & liturgy",
	"Combat taunts",
	"Trash talk & mid-fight",
	"Ally praise",
	"Casual filler",
	"Awe & fearful wonder",
	"Warmth & friendship",
]);
const REGISTERS = new Set(["guttural", "liturgical", "street", "cold"]);

describe("diabolic lexicon", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(lexicon)).toBe(true);
		expect(lexicon.length).toBeGreaterThan(0);
	});

	it("has no duplicate diabolic phrases", () => {
		const seen = new Set();
		const dupes = [];
		for (const p of lexicon) {
			if (seen.has(p.diabolic)) dupes.push(p.diabolic);
			seen.add(p.diabolic);
		}
		expect(dupes).toEqual([]);
	});

	it("every entry has valid required fields", () => {
		for (const p of lexicon) {
			expect(typeof p.diabolic, JSON.stringify(p)).toBe("string");
			expect(typeof p.english, p.diabolic).toBe("string");
			expect(Array.isArray(p.alts), p.diabolic).toBe(true);
			expect(VIBES.has(p.vibe), `${p.diabolic} has bad vibe "${p.vibe}"`).toBe(true);
			expect(REGISTERS.has(p.register), `${p.diabolic} has bad register "${p.register}"`).toBe(true);
		}
	});

	it("coined entries record when they first appeared", () => {
		for (const p of lexicon) {
			if (p.coined) expect(p.firstAppeared, p.diabolic).toBeTruthy();
		}
	});
});

describe("journal entries", () => {
	it("every {d:...} phrase used exists in the lexicon", () => {
		// Match case- and punctuation-insensitively so phrases can be adjusted
		// (capitalized, repunctuated) to fit the prose without falling out of sync.
		const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim();
		const known = new Set(lexicon.map(p => norm(p.diabolic)));
		const re = /\{d:([^:}]+):[^}]+\}/g;
		const missing = [];
		for (const e of entries) {
			let m;
			while ((m = re.exec(e.text)) !== null) {
				if (!known.has(norm(m[1]))) missing.push(m[1]);
			}
		}
		expect(missing).toEqual([]);
	});

	it("each entry has string date/text, and a string title when present", () => {
		for (const e of entries) {
			expect(typeof e.date).toBe("string");
			expect(typeof e.text).toBe("string");
			if ("title" in e) expect(typeof e.title).toBe("string");
		}
	});
});
