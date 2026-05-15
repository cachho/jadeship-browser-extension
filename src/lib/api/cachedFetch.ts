import { getStorage } from '../storage';

const ONE_DAY_MS = 86_400_000;

async function cacheGet(
  key: string
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
  value: { data: unknown; expires: number }
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
  init?: RequestInit
): Promise<Response> {
  const key = `cf:${init?.method ?? 'GET'}:${url}:${init?.body ?? ''}`;
  const now = Date.now();

  const hit = await cacheGet(key);
  if (hit) {
    if (hit.expires > now) {
      return new Response(JSON.stringify(hit.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await cacheRemove(key);
  }

  const response = await fetch(url, init);

  if (response.ok) {
    const data = await response.json();
    await cacheSet(key, { data, expires: now + ONE_DAY_MS });
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return response;
}
