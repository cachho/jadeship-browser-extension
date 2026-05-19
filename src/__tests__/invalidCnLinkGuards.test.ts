import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import { getDetails } from "../lib/api/getDetails";
import { getQc } from "../lib/api/getQc";
import { getStatsUrl } from "../lib/getStatsUrl";
import { hasValidMarketplaceAndId, isValidCnLink } from "../lib/isValidCnLink";

describe("invalid cnLink guards", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = mock(() => {
      throw new Error("fetch should not be called");
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("recognizes valid and invalid marketplace and id values", () => {
    expect(hasValidMarketplaceAndId("taobao", "123")).toBe(true);
    expect(hasValidMarketplaceAndId(undefined, "123")).toBe(false);
    expect(hasValidMarketplaceAndId("taobao", undefined)).toBe(false);
    expect(hasValidMarketplaceAndId("taobao", "undefined")).toBe(false);
    expect(hasValidMarketplaceAndId("invalid-marketplace", "123")).toBe(false);
    expect(isValidCnLink({ marketplace: "weidian", id: "456" })).toBe(true);
    expect(
      isValidCnLink({
        marketplace: undefined,
        id: undefined,
      }),
    ).toBe(false);
  });

  test("does not fetch QC data when marketplace or id is invalid", async () => {
    const response = await getQc(undefined, undefined);

    expect(response).toBeNull();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("does not fetch details when marketplace or id is invalid", async () => {
    const response = await getDetails({
      marketplace: undefined,
      id: undefined,
    });

    expect(response).toBeNull();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("does not build a stats url when marketplace or id is invalid", () => {
    expect(
      getStatsUrl({
        marketplace: undefined,
        id: undefined,
      }),
    ).toBeNull();
  });
});
