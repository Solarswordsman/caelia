import { describe, it, expect } from "vitest";
import { renderText } from "../journal/parse.js";

describe("renderText", () => {
	it("wraps {d:...} markers in a dbl span with a tooltip", () => {
		const html = renderText("Hi {d:Bene.:Good}.");
		expect(html).toContain('<span class="dbl">');
		expect(html).toContain('<span class="tip">"Good"</span>');
		expect(html).toContain("Bene.");
	});

	it("escapes HTML in plain text", () => {
		expect(renderText("a < b & c")).toBe("a &lt; b &amp; c");
	});

	it("escapes HTML inside marker fields", () => {
		const html = renderText('{d:<x>:a&b}');
		expect(html).toContain('"a&amp;b"');
		expect(html).toContain("&lt;x&gt;");
	});

	it("converts newlines to <br>", () => {
		expect(renderText("a\nb")).toBe("a<br>b");
	});

	it("handles multiple markers in one string", () => {
		const html = renderText("{d:A:one} and {d:B:two}");
		expect(html.match(/class="dbl"/g)).toHaveLength(2);
	});
});
