import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { getImageAgent } from "../lib/html/getImageAgent";
import { getPlatformImage } from "../lib/html/getPlatformImage";

describe("toolbar image markup", () => {
  const originalChrome = globalThis.chrome;

  beforeAll(() => {
    Object.defineProperty(globalThis, "chrome", {
      value: {
        runtime: {
          getURL: (src: string) => src,
        },
      },
      configurable: true,
    });
  });

  afterAll(() => {
    if (originalChrome === undefined) {
      delete (globalThis as typeof globalThis & { chrome?: unknown }).chrome;
    } else {
      Object.defineProperty(globalThis, "chrome", {
        value: originalChrome,
        configurable: true,
      });
    }
  });

  it("pins explicit dimensions for agent icons to resist page CSS overrides", () => {
    const agentHtml = getImageAgent("pandabuy");
    expect(agentHtml).toContain("width:16px");
    expect(agentHtml).toContain("height:16px");
    expect(agentHtml).toContain("display:block");
  });

  it("pins explicit dimensions for marketplace icons to resist page CSS overrides", () => {
    const platformHtml = getPlatformImage("weidian");
    expect(platformHtml).toContain("width:16px");
    expect(platformHtml).toContain("height:16px");
    expect(platformHtml).toContain("display:block");
  });
});
