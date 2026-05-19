import { describe, expect, test } from "bun:test";

import { Config } from "../Config";

describe("Config", () => {
	test("uses jadeship legal links", () => {
		expect(Config.legal.main.tos).toBe("https://www.jadeship.com/tos");
		expect(Config.legal.main.privacy).toBe(
			"https://www.jadeship.com/privacy-policy",
		);
	});
});
