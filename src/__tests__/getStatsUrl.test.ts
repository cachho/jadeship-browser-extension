import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { getStatsUrl } from "../lib/getStatsUrl";

describe("getStatsUrl", () => {
  test("returns null when cnLink is missing", () => {
    expect(getStatsUrl(null)).toBeNull();
  });

  test("builds details stats url from cnLink data", () => {
    expect(getStatsUrl({ id: "123", marketplace: "taobao" })).toBe(
      "https://www.jadeship.com/api/quota-limited/extension/v2/details/taobao/123"
    );
  });

  test("toolbar renders a Stats button for stats navigation", () => {
    const toolbarSource = readFileSync(
      new URL("../toolbar.ts", import.meta.url),
      "utf8"
    );

    expect(toolbarSource).toContain('"Stats"');
    expect(toolbarSource).toContain("statsUrl");
  });
});
