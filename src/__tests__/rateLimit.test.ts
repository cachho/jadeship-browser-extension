import { describe, expect, test } from "bun:test";

import { getRateLimitFromResponseBody } from "../lib/rateLimit";

describe("getRateLimitFromResponseBody", () => {
  test("returns parsed rate-limit values from response metadata", () => {
    const rateLimit = getRateLimitFromResponseBody({
      meta: {
        rateLimit: {
          remaining: "23",
          limit: "50",
        },
      },
    });

    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.remaining).toBe(23);
    expect(rateLimit?.limit).toBe(50);
  });

  test("accepts quoted/suffixed numeric values in metadata", () => {
    const rateLimit = getRateLimitFromResponseBody({
      meta: {
        rateLimit: {
          remaining: '"23"',
          limit: '"50";w=86400',
        },
      },
    });

    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.remaining).toBe(23);
    expect(rateLimit?.limit).toBe(50);
  });

  test("returns null when metadata is missing or invalid", () => {
    expect(getRateLimitFromResponseBody({})).toBeNull();
    expect(
      getRateLimitFromResponseBody({
        meta: {
          rateLimit: {
            remaining: "-1",
            limit: "50",
          },
        },
      }),
    ).toBeNull();
    expect(
      getRateLimitFromResponseBody({
        meta: {
          rateLimit: {
            remaining: "foo",
            limit: "50",
          },
        },
      }),
    ).toBeNull();
  });
});
