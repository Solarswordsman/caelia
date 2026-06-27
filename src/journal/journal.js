import "../shared/tokens.css";
import "./journal.css";
import { mountNav } from "../shared/nav.js";
import { esc } from "../shared/dom.js";
import { renderText } from "./parse.js";

mountNav();

// Dev-only: a handwriting-font explorer for the journal. The dynamic import is
// behind import.meta.env.DEV, so it's dropped from production builds entirely.
if (import.meta.env.DEV) {
	import("../dev/font-picker.js").then(m => m.mountFontPicker());
}

function render(entries) {
	const el = document.getElementById("entries");
	if (!entries.length) {
		el.innerHTML = '<div class="status-msg">(The pages are empty.)</div>';
		return;
	}
	el.innerHTML = entries.map(e =>
		`<div class="entry">
			<div class="entry-date">${esc(e.date)}</div>
			${e.title ? `<h2 class="entry-title">${esc(e.title)}</h2>` : ""}
			<div class="entry-text">${renderText(e.text)}</div>
		</div>`
	).join("");
}

fetch("/data/entries.json")
	.then(r => {
		if (!r.ok) throw new Error(r.statusText);
		return r.json();
	})
	.then(render)
	.catch(() => {
		document.getElementById("entries").innerHTML =
			'<div class="status-msg">(Could not load entries.)</div>';
	});
