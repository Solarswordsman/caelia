import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";

export default [
	{ ignores: ["dist", "coverage"] },
	{
		files: ["**/*.js"],
		languageOptions: {
			ecmaVersion: 2022,
			globals: { ...globals.browser },
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			"@stylistic": stylistic,
		},
		rules: {
			...js.configs.recommended.rules,
			// House style: tabs for indentation (see .editorconfig).
			"@stylistic/indent": ["error", "tab"],
			"no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
		},
	},
	{
		// Config files run in Node.
		files: ["*.config.js", "vite.config.js", "eslint.config.js"],
		languageOptions: { globals: { ...globals.node } },
	},
	{
		// Tests run in Node; Vitest APIs are imported explicitly.
		files: ["src/test/**", "**/*.test.js"],
		languageOptions: { globals: { ...globals.node } },
	},
];
