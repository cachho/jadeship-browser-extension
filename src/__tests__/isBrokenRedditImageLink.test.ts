import { describe, expect, it } from "bun:test";
import { isBrokenRedditImageLink } from "../lib/isBrokenRedditImageLink";

describe("isBrokenRedditImageLink", () => {
  it("should detect broken pandabuy links", () => {
    expect(isBrokenRedditImageLink("pandabuy.comproduct", "weidian")).toBe(
      true,
    );
  });

  it("should detect broken taobao links", () => {
    expect(isBrokenRedditImageLink("item.taobao.comitem", "taobao")).toBe(true);
    expect(isBrokenRedditImageLink("m.intl.taobao.comdetail", "taobao")).toBe(
      true,
    );
  });

  it("should not flag normal taobao links as broken", () => {
    expect(isBrokenRedditImageLink("item.taobao.com/item", "taobao")).toBe(
      false,
    );
  });

  it("should detect broken weidian links", () => {
    expect(isBrokenRedditImageLink("weidian.comitem", "weidian")).toBe(true);
    expect(isBrokenRedditImageLink("weidian.comfast", "weidian")).toBe(true);
  });

  it("should not flag normal weidian links as broken", () => {
    expect(isBrokenRedditImageLink("weidian.com/item", "weidian")).toBe(false);
  });

  it("should detect broken 1688 links", () => {
    expect(isBrokenRedditImageLink("m.1688.com...", "1688")).toBe(true);
    expect(isBrokenRedditImageLink("detail.1688.com...", "1688")).toBe(true);
  });

  it("should not flag normal 1688 links as broken", () => {
    expect(isBrokenRedditImageLink("m.1688.com/offer", "1688")).toBe(false);
  });

  it("should detect broken tmall links", () => {
    expect(isBrokenRedditImageLink("detail.tmall.comitem", "tmall")).toBe(true);
  });

  it("should return false for unknown platforms", () => {
    expect(isBrokenRedditImageLink("anything", "1688")).toBe(false);
  });
});
