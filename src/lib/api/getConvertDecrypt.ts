import { Config } from "../../Config";
import type { Agent, CnLink, Settings } from "../../models";
import { cachedFetch } from "./cachedFetch";

export type ConvertDecryptFetchError = {
  status: number;
  statusText: string;
};

/**
 * Convert and decrypt using the web API.
 */
export async function getConvertDecrypt(
  itemHref: string,
  targets: Settings["agentsInToolbar"],
  onFetchError?: (error: ConvertDecryptFetchError) => void,
): Promise<{
  data: Array<{ target: Agent; url: string }>;
  cnLink: CnLink;
} | null> {
  const url = new URL(Config.endpoint.convertDecrypt);
  url.searchParams.set("url", itemHref);
  url.searchParams.set("targets", ["raw", ...targets].join(","));
  const response = await cachedFetch(url.href);
  if (!response.ok) {
    const error = {
      status: response.status,
      statusText: response.statusText || "Unknown Error",
    };
    console.error(
      "Failed to fetch convert-decrypt:",
      `Error ${error.status}: ${error.statusText}`,
    );
    onFetchError?.(error);
    return null;
  }
  const json = (await response.json()) as {
    data: Array<{ target: Agent; url: string }>;
    meta: CnLink;
  };
  return { data: json.data, cnLink: json.meta };
}
