import { getStorage } from "./storage";

export const RATE_LIMIT_STORAGE_KEY = "rateLimit";

export type RateLimit = {
  remaining: number;
  limit: number;
  updatedAt: number;
};

function parseRateLimitInteger(value: string): number | null {
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
  const remaining = parseRateLimitInteger(remainingValue);
  const limit = parseRateLimitInteger(limitValue);
  if (remaining === null || limit === null) {
    return null;
  }
  if (remaining < 0 || limit <= 0) {
    return null;
  }
  return { remaining, limit, updatedAt: Date.now() };
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
