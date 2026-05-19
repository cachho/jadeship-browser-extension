import { describe, expect, it } from "bun:test";
import { convertableLinks } from "../data/convertableLinks";
import { isConvertableLink } from "../lib/isConvertableLink";

describe("isConvertableLink", () => {
  it("should return true for all convertable link hostnames", () => {
    convertableLinks.forEach((link) => {
      expect(isConvertableLink(new URL(`https://${link}/test`))).toBe(true);
    });
  });

  it("should return true for pandabuy redirect URLs", () => {
    expect(
      isConvertableLink(
        new URL("https://www.pandabuy.com/product?url=PI12345"),
      ),
    ).toBe(true);
    expect(
      isConvertableLink(new URL("https://pandabuy.com/product?url=PI99999")),
    ).toBe(true);
  });

  it("should return false for pandabuy URLs without PI pattern", () => {
    expect(
      isConvertableLink(new URL("https://www.pandabuy.com/product?url=ABC123")),
    ).toBe(false);
    expect(isConvertableLink(new URL("https://www.pandabuy.com/product"))).toBe(
      false,
    );
  });

  it("should return false for non-convertable URLs", () => {
    expect(isConvertableLink(new URL("https://www.google.com"))).toBe(false);
    expect(isConvertableLink(new URL("https://www.taobao.com"))).toBe(false);
    expect(isConvertableLink(new URL("https://www.reddit.com"))).toBe(false);
  });
});
