import { esc } from "../shared/dom.js";

/**
 * Render journal entry text, converting {d:DiabolicText:English meaning} markers
 * into crimson italic spans with hover tooltips. Newlines become <br>.
 * Pure (string in, HTML string out) so it can be unit-tested without a DOM.
 */
export function renderText(text) {
	const re = /\{d:([^:}]+):([^}]+)\}/g;
	const parts = [];
	let last = 0, m;

	while ((m = re.exec(text)) !== null) {
		if (m.index > last) parts.push({ t: "txt", v: text.slice(last, m.index) });
		parts.push({ t: "dbl", d: m[1], e: m[2] });
		last = m.index + m[0].length;
	}
	if (last < text.length) parts.push({ t: "txt", v: text.slice(last) });

	return parts.map(p =>
		p.t === "txt"
			? esc(p.v).replace(/\n/g, "<br>")
			: `<span class="dbl"><span class="tip">"${esc(p.e)}"</span>${esc(p.d)}</span>`
	).join("");
}
