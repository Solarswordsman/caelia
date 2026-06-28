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
		expect(model.months.map(m => m.label)).toEqual(["Lamashan 4725", "Rova 4725"]);
	});

	it("orders month groups newest-first (by Golarion calendar)", () => {
		expect(model.months[0].label).toBe("Lamashan 4725");
	});

	it("orders entries within a month newest-first, ties broken by later index", () => {
		const rova = model.months.find(m => m.label === "Rova 4725");
		expect(rova.items.map(it => it.index)).toEqual([3, 2, 1, 0]);
	});

	it("points mostRecentIndex at the single latest entry", () => {
		expect(model.mostRecentIndex).toBe(4);
	});

	it("buckets unparseable dates under 'Other', sorted last", () => {
		const { months } = buildTocModel([
			{ date: "1st of Rova, 4725 AR", text: "x" },
			{ date: "someday", text: "y" },
		]);
		expect(months.at(-1).label).toBe("Other");
	});
});
