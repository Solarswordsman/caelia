import { esc } from "../shared/dom.js";

// Golarion calendar, in order — used to sort month groups chronologically.
const MONTHS = [
	"Abadius", "Calistril", "Pharast", "Gozran", "Desnus", "Sarenith",
	"Erastus", "Arodus", "Rova", "Lamashan", "Neth", "Kuthona",
];

/** Parse "28th of Rova, 4725 AR" → { day, dayNum, month, monthIdx, year }, or null. */
function parseDate(date) {
	const m = /^(\S+)\s+of\s+(\w+),\s+(\d+)\s*AR$/.exec(date || "");
	if (!m) return null;
	const [, day, month, yearStr] = m;
	return {
		day,
		dayNum: parseInt(day, 10) || 0,
		month,
		monthIdx: MONTHS.indexOf(month),
		year: parseInt(yearStr, 10),
	};
}

// Single comparable number for "how recent": month-of-era * 100 + day.
function recencyRank(it) {
	if (!it.p) return -1;
	return (it.p.year * 12 + it.p.monthIdx) * 100 + it.p.dayNum;
}

/**
 * Build the table-of-contents model from journal entries (render order; the
 * array index is the scroll-anchor id). Pure — no DOM — so it can be tested.
 * Mirrors the page: months oldest-first, entries within a month oldest-first.
 * The month containing the single latest entry is flagged `current` (expanded
 * by default), and mostRecentIndex points at that latest entry.
 */
export function buildTocModel(entries) {
	const items = entries.map((e, index) => ({
		index,
		date: e.date,
		title: e.title,
		p: parseDate(e.date),
	}));

	const groups = new Map();
	for (const it of items) {
		const key = it.p ? `${it.p.month} ${it.p.year}` : "Other";
		if (!groups.has(key)) {
			groups.set(key, {
				key,
				label: key,
				sort: it.p ? it.p.year * 12 + it.p.monthIdx : -1,
				items: [],
			});
		}
		groups.get(key).items.push(it);
	}

	const months = [...groups.values()].sort((a, b) => a.sort - b.sort);
	for (const g of months) {
		g.items.sort((a, b) =>
			(a.p ? a.p.dayNum : 0) - (b.p ? b.p.dayNum : 0) || a.index - b.index);
	}

	let recent = null;
	for (const it of items) {
		if (!recent
			|| recencyRank(it) > recencyRank(recent)
			|| (recencyRank(it) === recencyRank(recent) && it.index > recent.index)) {
			recent = it;
		}
	}
	const mostRecentIndex = recent ? recent.index : null;
	const currentMonthKey = recent ? (recent.p ? `${recent.p.month} ${recent.p.year}` : "Other") : null;
	for (const g of months) g.current = g.key === currentMonthKey;

	return { months, mostRecentIndex, currentMonthKey };
}

function entryLabel(it) {
	const day = it.p ? it.p.day : it.date;
	return it.title ? `${day} · ${it.title}` : day;
}

function scrollToAnchor(id) {
	const el = document.getElementById(id);
	if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Render the floating contents rail + its mobile toggle chip, and wire them. */
export function mountToc(entries) {
	const { months, mostRecentIndex } = buildTocModel(entries);
	if (!months.length) return;

	const nav = document.createElement("nav");
	nav.className = "toc";
	nav.setAttribute("aria-label", "Journal contents");
	nav.innerHTML = `
		<div class="toc__title">Contents</div>
		${mostRecentIndex != null
			? `<button class="toc__recent" data-target="entry-${mostRecentIndex}">Most recent ↡</button>`
			: ""}
		<ul class="toc__months">
			${months.map(g => `
				<li class="toc__month${g.current ? " is-open" : ""}">
					<button class="toc__month-head" aria-expanded="${Boolean(g.current)}">
						<span class="toc__caret" aria-hidden="true">▸</span><span>${esc(g.label)}</span>
					</button>
					<ul class="toc__entries">
						${g.items.map(it => `
							<li><button class="toc__entry" data-target="entry-${it.index}">${esc(entryLabel(it))}</button></li>
						`).join("")}
					</ul>
				</li>
			`).join("")}
		</ul>
	`;

	const toggle = document.createElement("button");
	toggle.className = "toc-toggle";
	toggle.setAttribute("aria-label", "Toggle journal contents");
	toggle.setAttribute("aria-expanded", "false");
	toggle.innerHTML = `<span aria-hidden="true">☰</span> Contents`;

	const isOverlay = () => window.matchMedia("(max-width: 1150px)").matches;
	const setVisible = open => {
		nav.classList.toggle("is-visible", open);
		toggle.setAttribute("aria-expanded", String(open));
	};

	toggle.addEventListener("click", () => setVisible(!nav.classList.contains("is-visible")));

	nav.addEventListener("click", ev => {
		const head = ev.target.closest(".toc__month-head");
		if (head) {
			const li = head.parentElement;
			const open = li.classList.toggle("is-open");
			head.setAttribute("aria-expanded", String(open));
			return;
		}
		const link = ev.target.closest("[data-target]");
		if (link) {
			scrollToAnchor(link.dataset.target);
			if (isOverlay()) setVisible(false);
		}
	});

	document.body.append(nav, toggle);
}
