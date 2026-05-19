import { RATE_LIMIT_STORAGE_KEY, saveRateLimitToStorage } from "../rateLimit";
import { getStorage } from "../storage";

const ONE_DAY_MS = 86_400_000;

async function cacheGet(
  key: string,
): Promise<{ data: unknown; expires: number } | null> {
  const storage = getStorage();
  if (!storage) return null;
  const result = await storage.local.get(key);
  return (
    (result[key] as { data: unknown; expires: number } | undefined) ?? null
  );
}

async function cacheSet(
  key: string,
  value: { data: unknown; expires: number },
): Promise<void> {
  const storage = getStorage();
  if (!storage) return;
  await storage.local.set({ [key]: value });
}

async function cacheRemove(key: string): Promise<void> {
  const storage = getStorage();
  if (!storage) return;
  await storage.local.remove(key);
}

export async function cachedFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const key = `cf:${init?.method ?? "GET"}:${url}:${init?.body ?? ""}`;
  const now = Date.now();

  const hit = await cacheGet(key);
  if (hit) {
    if (hit.expires > now) {
      return new Response(JSON.stringify(hit.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    await cacheRemove(key);
  }

  const response = await fetch(url, init);
  const savedRateLimit = await saveRateLimitToStorage(response.headers);
  if (!savedRateLimit && response.status === 429) {
    const storage = getStorage();
    if (storage) {
      const result = await storage.local.get(RATE_LIMIT_STORAGE_KEY);
      const previousRateLimit = result[RATE_LIMIT_STORAGE_KEY] as
        | { limit?: number }
        | undefined;
      if (
        typeof previousRateLimit?.limit === "number" &&
        previousRateLimit.limit > 0
      ) {
        await storage.local.set({
          [RATE_LIMIT_STORAGE_KEY]: {
            remaining: 0,
            limit: previousRateLimit.limit,
            updatedAt: Date.now(),
          },
        });
      }
    }
  }

  if (response.ok) {
    const data = await response.json();
    await cacheSet(key, { data, expires: now + ONE_DAY_MS });
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return response;
}
