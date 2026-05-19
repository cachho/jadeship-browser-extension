import { RateLimitHeadersEnum } from "../models/RateLimitHeaders";
import { getStorage } from "./storage";

export const RATE_LIMIT_STORAGE_KEY = "rateLimit";

export type RateLimit = {
  remaining: number;
  limit: number;
  updatedAt: number;
};

const ALT_RATE_LIMIT_REMAINING_HEADERS = [
  "RateLimit-Remaining",
  "X-Rate-Limit-Remaining",
];

const ALT_RATE_LIMIT_LIMIT_HEADERS = ["RateLimit-Limit", "X-Rate-Limit-Limit"];

function normalizeHeaderName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getHeaderValue(headers: Headers, names: string[]): string | null {
  for (const name of names) {
    const value = headers.get(name);
    if (value !== null) {
      return value;
    }
  }
  const normalizedNames = new Set(names.map(normalizeHeaderName));
  for (const [name, value] of headers.entries()) {
    if (normalizedNames.has(normalizeHeaderName(name))) {
      return value;
    }
  }
  return null;
}

function parseHeaderInteger(value: string): number | null {
  const match = value.match(/-?\d+/);
  if (!match) {
    return null;
  }
  const parsed = Number.parseInt(match[0], 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function getRateLimitFromValues(
  remainingValue: string,
  limitValue: string,
): RateLimit | null {
  const remaining = parseHeaderInteger(remainingValue);
  const limit = parseHeaderInteger(limitValue);
  if (remaining === null || limit === null) {
    return null;
  }
  if (remaining < 0 || limit <= 0) {
    return null;
  }
  return { remaining, limit, updatedAt: Date.now() };
}

export function getRateLimitFromHeaders(headers: Headers): RateLimit | null {
  const remainingHeader = getHeaderValue(headers, [
    RateLimitHeadersEnum.Remaining,
    ...ALT_RATE_LIMIT_REMAINING_HEADERS,
  ]);
  const limitHeader = getHeaderValue(headers, [
    RateLimitHeadersEnum.Limit,
    ...ALT_RATE_LIMIT_LIMIT_HEADERS,
  ]);
  if (remainingHeader === null || limitHeader === null) {
    return null;
  }
  return getRateLimitFromValues(remainingHeader, limitHeader);
}

export function getRateLimitFromResponseBody(data: unknown): RateLimit | null {
  const metaRateLimit = (
    data as {
      meta?: {
        rateLimit?: {
          remaining?: string | number;
          limit?: string | number;
        };
      };
    }
  )?.meta?.rateLimit;
  if (!metaRateLimit) {
    return null;
  }
  const remaining = metaRateLimit.remaining;
  const limit = metaRateLimit.limit;
  if (
    (typeof remaining !== "string" && typeof remaining !== "number") ||
    (typeof limit !== "string" && typeof limit !== "number")
  ) {
    return null;
  }
  return getRateLimitFromValues(String(remaining), String(limit));
}

export async function saveRateLimitToStorage(
  headers: Headers,
): Promise<RateLimit | null> {
  const rateLimit = getRateLimitFromHeaders(headers);
  if (!rateLimit) {
    return null;
  }
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  await storage.local.set({ [RATE_LIMIT_STORAGE_KEY]: rateLimit });
  return rateLimit;
}

export async function saveRateLimitFromResponseBodyToStorage(
  data: unknown,
): Promise<RateLimit | null> {
  const rateLimit = getRateLimitFromResponseBody(data);
  if (!rateLimit) {
    return null;
  }
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  await storage.local.set({ [RATE_LIMIT_STORAGE_KEY]: rateLimit });
  return rateLimit;
}
