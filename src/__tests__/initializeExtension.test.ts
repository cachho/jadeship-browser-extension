import { describe, expect, test } from "bun:test";

import { isStoredValueEqual } from "../lib/initializeExtension";
import { defaultSettings } from "../models/Settings";

describe("isStoredValueEqual", () => {
	test("matches primitive settings values", () => {
		expect(isStoredValueEqual(true, true)).toBe(true);
		expect(
			isStoredValueEqual(defaultSettings.myAgent, defaultSettings.myAgent),
		).toBe(true);
	});

	test("matches array settings values by content", () => {
		const storedValue = [...defaultSettings.agentsInToolbar];
		expect(storedValue).not.toBe(defaultSettings.agentsInToolbar);
		expect(
			isStoredValueEqual(storedValue, defaultSettings.agentsInToolbar),
		).toBe(true);
	});

	test("does not match different array values", () => {
		expect(
			isStoredValueEqual(
				[...defaultSettings.agentsInToolbar, "cnfans"],
				defaultSettings.agentsInToolbar,
			),
		).toBe(false);
	});
});
