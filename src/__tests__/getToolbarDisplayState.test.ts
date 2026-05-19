import { describe, expect, it } from "bun:test";

import {
	getConvertErrorMessage,
	getToolbarDisplayState,
} from "../lib/toolbar/getToolbarDisplayState";

describe("getToolbarDisplayState", () => {
	it("hides toolbar body when collapsed", () => {
		expect(getToolbarDisplayState(true)).toEqual({
			isBodyHidden: true,
		});
	});

	it("keeps toolbar body visible when expanded", () => {
		expect(getToolbarDisplayState(false)).toEqual({
			isBodyHidden: false,
		});
	});
});

describe("getConvertErrorMessage", () => {
	it("formats convert-decrypt error with status code and name", () => {
		expect(getConvertErrorMessage(503, "Service Unavailable")).toBe(
			"Failed to get converted links (Error 503: Service Unavailable)",
		);
	});
});
