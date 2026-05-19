import { describe, expect, it } from "bun:test";
import { detectMarketplace } from "../lib/cn-links/detectMarketplace";

describe("detectMarketplace", () => {
	it("should detect weidian from weidian.com URLs", () => {
		expect(detectMarketplace("https://weidian.com/item.html?id=1")).toBe(
			"weidian",
		);
		expect(detectMarketplace("https://www.weidian.com/item.html?id=1")).toBe(
			"weidian",
		);
	});

	it("should detect taobao from taobao.com URLs", () => {
		expect(detectMarketplace("https://item.taobao.com/item.htm?id=1")).toBe(
			"taobao",
		);
		expect(detectMarketplace("https://www.taobao.com/item.htm?id=1")).toBe(
			"taobao",
		);
	});

	it("should detect 1688 from 1688.com URLs", () => {
		expect(detectMarketplace("https://detail.1688.com/offer/1.html")).toBe(
			"1688",
		);
		expect(detectMarketplace("https://www.1688.com/offer/1.html")).toBe("1688");
	});

	it("should detect tmall from tmall.com URLs", () => {
		expect(detectMarketplace("https://detail.tmall.com/item.htm?id=1")).toBe(
			"tmall",
		);
		expect(detectMarketplace("https://www.tmall.com/item.htm?id=1")).toBe(
			"tmall",
		);
	});

	it("should return undefined for non-marketplace URLs", () => {
		expect(detectMarketplace("https://www.google.com")).toBeUndefined();
		expect(detectMarketplace("https://www.reddit.com")).toBeUndefined();
		expect(detectMarketplace("https://www.pandabuy.com")).toBeUndefined();
	});

	it("should handle URL objects", () => {
		const url = new URL("https://item.taobao.com/item.htm?id=1");
		expect(detectMarketplace(url)).toBe("taobao");
	});
});
