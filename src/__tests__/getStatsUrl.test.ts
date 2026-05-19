import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { getStatsUrl } from "../lib/getStatsUrl";

describe("getStatsUrl", () => {
	test("returns null when cnLink is missing", () => {
		expect(getStatsUrl(null)).toBeNull();
	});

	test("builds stats page url from cnLink data", () => {
		expect(getStatsUrl({ id: "123", marketplace: "taobao" })).toBe(
			"https://www.jadeship.com/item/taobao/123?r=extension",
		);
	});

	test("toolbar renders a Stats button for stats navigation", () => {
		const toolbarSource = readFileSync(
			new URL("../toolbar.ts", import.meta.url),
			"utf8",
		);

		expect(toolbarSource).toContain('"Stats"');
		expect(toolbarSource).toContain("statsUrl");
	});
});
