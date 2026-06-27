import "./nav.css";

// Tabs shown in the top nav. Add a new tool here and it appears everywhere.
const TABS = [
	{ href: "/journal/", label: "Journal" },
	{ href: "/diabolic/", label: "Diabolic" },
];

function currentPath() {
	return window.location.pathname.replace(/index\.html$/, "");
}

function isActive(href, path) {
	const base = href.replace(/\/$/, "");
	return path === href || path === base || path.startsWith(href);
}

/** Inject the shared top nav at the start of <body>. */
export function mountNav() {
	const path = currentPath();
	const nav = document.createElement("nav");
	nav.className = "site-nav";
	nav.innerHTML = `
		<a class="site-nav__brand" href="/">Caelia</a>
		<ul class="site-nav__tabs">
			${TABS.map(t => `
				<li><a class="site-nav__tab${isActive(t.href, path) ? " is-active" : ""}" href="${t.href}">${t.label}</a></li>
			`).join("")}
		</ul>
	`;
	document.body.prepend(nav);
}
