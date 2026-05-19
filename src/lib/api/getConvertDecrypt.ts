import { Config } from "../../Config";
import type { Agent, CnLink, Settings } from "../../models";
import { cachedFetch } from "./cachedFetch";

/**
 * Convert and decrypt using the web API.
 */
export async function getConvertDecrypt(
  itemHref: string,
  targets: Settings["agentsInToolbar"],
): Promise<{
  data: Array<{ target: Agent; url: string }>;
  cnLink: CnLink;
} | null> {
  const url = new URL(Config.endpoint.convertDecrypt);
  url.searchParams.set("url", itemHref);
  url.searchParams.set("targets", ["raw", ...targets].join(","));
  const response = await cachedFetch(url.href);
  if (!response.ok) {
    console.error("Failed to fetch convert-decrypt:", response.statusText);
    return null;
  }
  const json = (await response.json()) as {
    data: Array<{ target: Agent; url: string }>;
    meta: CnLink;
  };
  return { data: json.data, cnLink: json.meta };
}
