import { defineConfig } from "vite";
import { resolve } from "node:path";

// https://vite.dev/config/
// Multi-page static site: one HTML entry per app (hub / journal / diabolic).
const root = import.meta.dirname;

export default defineConfig({
	// Served from the site root on Netlify; no sub-path needed.
	base: "/",
	build: {
		rollupOptions: {
			input: {
				main: resolve(root, "index.html"),
				journal: resolve(root, "journal/index.html"),
				diabolic: resolve(root, "diabolic/index.html"),
			},
		},
	},
	test: {
		// Tests are pure (string parsing + reading JSON from disk); no DOM needed.
		environment: "node",
	},
});
