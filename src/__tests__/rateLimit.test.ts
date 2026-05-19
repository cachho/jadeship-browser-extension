import { describe, expect, test } from "bun:test";

import {
  getRateLimitFromHeaders,
  getRateLimitFromResponseBody,
} from "../lib/rateLimit";
import { RateLimitHeadersEnum } from "../models/RateLimitHeaders";

describe("getRateLimitFromHeaders", () => {
  test("returns parsed rate-limit values when headers are present", () => {
    const headers = new Headers({
      [RateLimitHeadersEnum.Remaining]: "10",
      [RateLimitHeadersEnum.Limit]: "100",
    });

    const rateLimit = getRateLimitFromHeaders(headers);

    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.remaining).toBe(10);
    expect(rateLimit?.limit).toBe(100);
  });

  test("accepts zero remaining when limit is positive", () => {
    const headers = new Headers({
      [RateLimitHeadersEnum.Remaining]: "0",
      [RateLimitHeadersEnum.Limit]: "50",
    });

    const rateLimit = getRateLimitFromHeaders(headers);

    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.remaining).toBe(0);
    expect(rateLimit?.limit).toBe(50);
  });

  test("reads headers case-insensitively", () => {
    const headers = new Headers({
      "x-ratelimit-remaining": "7",
      "x-ratelimit-limit": "50",
    });

    const rateLimit = getRateLimitFromHeaders(headers);

    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.remaining).toBe(7);
    expect(rateLimit?.limit).toBe(50);
  });

  test("supports alternate rate-limit header names", () => {
    const headers = new Headers({
      "ratelimit-remaining": "3",
      "ratelimit-limit": "50",
    });

    const rateLimit = getRateLimitFromHeaders(headers);

    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.remaining).toBe(3);
    expect(rateLimit?.limit).toBe(50);
  });

  test("parses numeric values wrapped in quotes or policy suffixes", () => {
    const headers = new Headers({
      [RateLimitHeadersEnum.Remaining]: '"23"',
      [RateLimitHeadersEnum.Limit]: '"50";w=86400',
    });

    const rateLimit = getRateLimitFromHeaders(headers);

    expect(rateLimit).not.toBeNull();
    expect(rateLimit?.remaining).toBe(23);
    expect(rateLimit?.limit).toBe(50);
  });

  test("returns null for missing or invalid headers", () => {
    expect(getRateLimitFromHeaders(new Headers())).toBeNull();
    expect(
      getRateLimitFromHeaders(
        new Headers({
          [RateLimitHeadersEnum.Remaining]: "foo",
          [RateLimitHeadersEnum.Limit]: "100",
        }),
      ),
    ).toBeNull();
    expect(
      getRateLimitFromHeaders(
        new Headers({
          [RateLimitHeadersEnum.Remaining]: "0",
          [RateLimitHeadersEnum.Limit]: "0",
        }),
      ),
    ).toBeNull();
  });
});

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
  });
});
