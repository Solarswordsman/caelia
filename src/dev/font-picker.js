import "./font-picker.css";

// Dev-only handwriting-font explorer for the journal. Overrides the --font-hand
// token (so it swaps both the body text and the name in the header), loads the
// candidate families from Google Fonts on demand, and remembers the choice.

const STORAGE_KEY = "caelia:journal-font";

// label → CSS font-family stack. Reenie Beanie + Caveat ship in production
// (tokens.css); the rest are fetched lazily by loadGoogleFonts().
const FONTS = [
	{ label: "Reenie Beanie (default)", stack: "'Reenie Beanie', cursive" },
	{ label: "Caveat", stack: "'Caveat', cursive" },
	{ label: "Kalam", stack: "'Kalam', cursive" },
	{ label: "Shadows Into Light", stack: "'Shadows Into Light', cursive" },
	{ label: "Patrick Hand", stack: "'Patrick Hand', cursive" },
	{ label: "Architects Daughter", stack: "'Architects Daughter', cursive" },
	{ label: "Indie Flower", stack: "'Indie Flower', cursive" },
	{ label: "Gloria Hallelujah", stack: "'Gloria Hallelujah', cursive" },
	{ label: "Just Another Hand", stack: "'Just Another Hand', cursive" },
	{ label: "Homemade Apple", stack: "'Homemade Apple', cursive" },
];

function loadGoogleFonts() {
	const families = [
		"Kalam", "Shadows+Into+Light", "Patrick+Hand", "Architects+Daughter",
		"Indie+Flower", "Gloria+Hallelujah", "Just+Another+Hand", "Homemade+Apple",
	];
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join("&")}&display=swap`;
	document.head.appendChild(link);
}

function applyFont(stack) {
	document.documentElement.style.setProperty("--font-hand", stack);
}

export function mountFontPicker() {
	loadGoogleFonts();

	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) applyFont(saved);

	const wrap = document.createElement("div");
	wrap.className = "font-picker";

	const label = document.createElement("span");
	label.className = "font-picker__label";
	label.textContent = "Journal font · dev";

	const select = document.createElement("select");
	select.className = "font-picker__select";
	FONTS.forEach(f => {
		const opt = document.createElement("option");
		opt.value = f.stack;
		opt.textContent = f.label;
		if (saved === f.stack) opt.selected = true;
		select.appendChild(opt);
	});
	select.addEventListener("change", () => {
		applyFont(select.value);
		localStorage.setItem(STORAGE_KEY, select.value);
	});

	wrap.append(label, select);
	document.body.appendChild(wrap);
}
