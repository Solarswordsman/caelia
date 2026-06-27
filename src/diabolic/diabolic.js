import "../shared/tokens.css";
import "./diabolic.css";
import { mountNav } from "../shared/nav.js";
import { esc } from "../shared/dom.js";

mountNav();

// Vibe order + sub-labels for the reference page. The lexicon is the source of
// truth for phrases; this just controls section order and descriptions.
const VIBES = [
	{ vibe: "Expletives & frustration", sub: "reflex curses, things slipping out" },
	{ vibe: "Dread & dark omens", sub: "quiet, cold, or foreboding" },
	{ vibe: "Warding & liturgy", sub: "childhood programming cracking through" },
	{ vibe: "Combat taunts", sub: "deliberate, blood is up" },
	{ vibe: "Trash talk & mid-fight", sub: "muttered, frustrated, contemptuous" },
	{ vibe: "Ally praise", sub: "when someone lands a good hit" },
	{ vibe: "Casual filler", sub: "slips out without thinking" },
	{ vibe: "Awe & fearful wonder", sub: "when something is too big for normal words" },
	{ vibe: "Warmth & friendship", sub: "genuine, though she'd never admit it" },
];

const filtersEl = document.getElementById("filters");
const contentEl = document.getElementById("content");
let active = "all";
let sections = [];

function groupByVibe(lexicon) {
	return VIBES
		.map(({ vibe, sub }) => ({
			vibe,
			sub,
			entries: lexicon.filter(p => p.vibe === vibe),
		}))
		.filter(s => s.entries.length);
}

function renderEntry(e) {
	const altsHtml = !e.alts || e.alts.length === 0
		? '<span class="alt-item" style="color:var(--text-faint)">—</span>'
		: e.alts.map((a, i, arr) =>
			`<span class="alt-item">${esc(a)}</span>${i < arr.length - 1 ? '<span class="alt-sep">◆</span>' : ""}`
		).join("");
	return `
		<div class="entry">
			<div class="meaning"><div class="meaning-inner">
				<span class="meaning-quote">"${esc(e.english)}"</span>
				${e.usage ? `<span class="meaning-usage">${esc(e.usage)}</span>` : ""}
			</div></div>
			<div class="phrase-block">
				<div class="phrase-main">${esc(e.diabolic)}</div>
				<div class="phrase-alts">${altsHtml}</div>
			</div>
		</div>`;
}

function render() {
	contentEl.innerHTML = "";
	const shown = active === "all" ? sections : sections.filter(s => s.vibe === active);
	shown.forEach(section => {
		const sec = document.createElement("div");
		sec.className = "section";
		sec.innerHTML = `
			<div class="section-head">
				<span class="section-title">${esc(section.vibe)}</span>
				<span class="section-sub">${esc(section.sub)}</span>
			</div>
			<div class="col-head">
				<span class="ch">Meaning / usage</span>
				<span class="ch">Phrase — alternates</span>
			</div>
			${section.entries.map(renderEntry).join("")}
		`;
		contentEl.appendChild(sec);
	});
}

function updatePills() {
	document.querySelectorAll(".pill").forEach(p => {
		p.classList.toggle("active", p.textContent === "All" ? active === "all" : p.textContent === active);
	});
}

function buildFilters() {
	const allPill = document.createElement("button");
	allPill.className = "pill active";
	allPill.textContent = "All";
	allPill.onclick = () => { active = "all"; updatePills(); render(); };
	filtersEl.appendChild(allPill);

	sections.forEach(s => {
		const p = document.createElement("button");
		p.className = "pill";
		p.textContent = s.vibe;
		p.onclick = () => { active = s.vibe; updatePills(); render(); };
		filtersEl.appendChild(p);
	});
}

fetch("/data/diabolic-lexicon.json")
	.then(r => {
		if (!r.ok) throw new Error(r.statusText);
		return r.json();
	})
	.then(lexicon => {
		sections = groupByVibe(lexicon);
		buildFilters();
		render();
	})
	.catch(() => {
		contentEl.innerHTML = '<div class="status-msg">(Could not load the lexicon.)</div>';
	});
