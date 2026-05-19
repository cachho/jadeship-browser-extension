import { Config } from "../../Config";
import type { Agent, CnLink, Settings } from "../../models";
import { cachedFetch } from "./cachedFetch";

export type ConvertDecryptFetchError = {
  status: number;
  statusText: string;
};

const HTTP_STATUS_TEXT: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot",
  421: "Misdirected Request",
  422: "Unprocessable Content",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
};

export function resolveHttpStatusText(
  status: number,
  statusText: string,
): string {
  const trimmed = statusText.trim();
  if (trimmed) return trimmed;
  return HTTP_STATUS_TEXT[status] ?? "Unknown Error";
}

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
      statusText: resolveHttpStatusText(response.status, response.statusText),
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
    serial: CnLink;
  };
  return { data: json.data, cnLink: json.serial };
}
