import { describe, it, expect } from "bun:test";
import { getDomain } from "../lib/getDomain";

describe("getDomain", () => {
  it("should extract domain from standard URLs", () => {
    expect(getDomain(new URL("https://www.example.com/page"))).toBe("example.com");
    expect(getDomain(new URL("https://sub.example.com/page"))).toBe("example.com");
    expect(getDomain(new URL("https://deep.sub.example.com"))).toBe("example.com");
  });

  it("should handle marketplace domains", () => {
    expect(getDomain(new URL("https://item.taobao.com/item.htm"))).toBe("taobao.com");
    expect(getDomain(new URL("https://detail.1688.com/offer"))).toBe("1688.com");
    expect(getDomain(new URL("https://weidian.com/item.html"))).toBe("weidian.com");
    expect(getDomain(new URL("https://detail.tmall.com/item.htm"))).toBe("tmall.com");
  });

  it("should handle agent domains", () => {
    expect(getDomain(new URL("https://www.pandabuy.com/product"))).toBe("pandabuy.com");
    expect(getDomain(new URL("https://www.sugargoo.com"))).toBe("sugargoo.com");
    expect(getDomain(new URL("https://hoobuy.com/product"))).toBe("hoobuy.com");
  });

  it("should return single-part hostnames as-is", () => {
    expect(getDomain(new URL("http://localhost:3000"))).toBe("localhost");
  });

  it("should handle short domain extensions", () => {
    expect(getDomain(new URL("https://m.tb.cn/item"))).toBe("tb.cn");
    expect(getDomain(new URL("https://qr.1688.com"))).toBe("1688.com");
  });
});
