import { describe, it, expect } from "vitest";
import { buildTocModel } from "../journal/toc.js";

const entries = [
	{ date: "6th of Rova, 4725 AR", text: "a" },
	{ date: "7th of Rova, 4725 AR", text: "b" },
	{ date: "28th of Rova, 4725 AR", text: "c" },
	{ date: "28th of Rova, 4725 AR", title: "Goblins...", text: "d" },
	{ date: "3rd of Lamashan, 4725 AR", text: "e" },
];

describe("buildTocModel", () => {
	const model = buildTocModel(entries);

	it("groups entries by month + year", () => {
		expect(model.months.map(m => m.label)).toEqual(["Rova 4725", "Lamashan 4725"]);
	});

	it("orders month groups oldest-first (by Golarion calendar)", () => {
		expect(model.months[0].label).toBe("Rova 4725");
	});

	it("orders entries within a month oldest-first, ties by original index", () => {
		const rova = model.months.find(m => m.label === "Rova 4725");
		expect(rova.items.map(it => it.index)).toEqual([0, 1, 2, 3]);
	});

	it("points mostRecentIndex at the single latest entry", () => {
		expect(model.mostRecentIndex).toBe(4);
	});

	it("flags the latest month as current (default-expanded)", () => {
		expect(model.currentMonthKey).toBe("Lamashan 4725");
		expect(model.months.find(m => m.current).label).toBe("Lamashan 4725");
	});

	it("buckets unparseable dates under 'Other', sorted first (oldest)", () => {
		const { months } = buildTocModel([
			{ date: "1st of Rova, 4725 AR", text: "x" },
			{ date: "someday", text: "y" },
		]);
		expect(months[0].label).toBe("Other");
	});
});
