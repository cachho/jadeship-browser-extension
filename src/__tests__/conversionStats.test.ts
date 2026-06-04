import { describe, expect, test } from "bun:test";

import { getConversionStatsFromStorageValue } from "../lib/conversionStats";

describe("getConversionStatsFromStorageValue", () => {
  test("returns sanitized values for valid stats payloads", () => {
    const stats = getConversionStatsFromStorageValue({
      onPage: 12,
      toolbar: 7,
      updatedAt: 12345,
    });

    expect(stats.onPage).toBe(12);
    expect(stats.toolbar).toBe(7);
    expect(stats.updatedAt).toBe(12345);
  });

  test("falls back to zero for invalid or negative values", () => {
    const stats = getConversionStatsFromStorageValue({
      onPage: -1,
      toolbar: Number.NaN,
      updatedAt: "nope",
    });

    expect(stats.onPage).toBe(0);
    expect(stats.toolbar).toBe(0);
    expect(stats.updatedAt).toBe(0);
  });
});
