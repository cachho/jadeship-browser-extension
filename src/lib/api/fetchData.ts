import { cachedFetch } from "./cachedFetch";

export async function fetchData<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const response = await cachedFetch(url, init);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    // Debug: Enable the next line
    // console.error(error);
    return null;
  }
}
