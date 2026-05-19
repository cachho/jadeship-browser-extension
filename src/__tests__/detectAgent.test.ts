import { describe, expect, it } from "bun:test";
import { agents } from "../lib/cn-links";
import { detectAgent } from "../lib/cn-links/detectAgent";

describe("detectAgent", () => {
  it("should detect every agent from its hostname", () => {
    agents.forEach((agent) => {
      const url = `https://www.${agent}.com/product/123`;
      expect(detectAgent(url)).toBe(agent);
    });
  });

  it("should handle URL objects", () => {
    const url = new URL("https://www.pandabuy.com/product/123");
    expect(detectAgent(url)).toBe("pandabuy");
  });

  it("should detect agent from subdomain URLs", () => {
    expect(detectAgent("https://buy.pandabuy.com/item/1")).toBe("pandabuy");
  });

  it("should return undefined for non-agent URLs", () => {
    expect(detectAgent("https://www.google.com")).toBeUndefined();
    expect(detectAgent("https://www.reddit.com")).toBeUndefined();
    expect(detectAgent("https://www.taobao.com")).toBeUndefined();
  });

  it("should return undefined for malformed URLs", () => {
    expect(() => detectAgent("not-a-url")).toThrow();
  });
});
