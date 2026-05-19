import { RateLimitHeadersEnum } from "../models/RateLimitHeaders";
import { getStorage } from "./storage";

export const RATE_LIMIT_STORAGE_KEY = "rateLimit";

export type RateLimit = {
  remaining: number;
  limit: number;
  updatedAt: number;
};

export function getRateLimitFromHeaders(headers: Headers): RateLimit | null {
  const remainingHeader = headers.get(RateLimitHeadersEnum.Remaining);
  const limitHeader = headers.get(RateLimitHeadersEnum.Limit);
  if (remainingHeader === null || limitHeader === null) {
    return null;
  }
  const remaining = Number.parseInt(remainingHeader, 10);
  const limit = Number.parseInt(limitHeader, 10);
  if (!Number.isFinite(remaining) || !Number.isFinite(limit)) {
    return null;
  }
  if (remaining < 0 || limit <= 0) {
    return null;
  }
  return { remaining, limit, updatedAt: Date.now() };
}

export async function saveRateLimitToStorage(headers: Headers): Promise<void> {
  const rateLimit = getRateLimitFromHeaders(headers);
  if (!rateLimit) {
    return;
  }
  const storage = getStorage();
  if (!storage) {
    return;
  }
  await storage.local.set({ [RATE_LIMIT_STORAGE_KEY]: rateLimit });
}
