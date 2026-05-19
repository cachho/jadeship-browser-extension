import { Config } from "../../Config";
import type { Agent, CnLink, Settings } from "../../models";
import { cachedFetch } from "./cachedFetch";

type ConvertDecryptSuccess = {
	data: Array<{ target: Agent; url: string }>;
	cnLink: CnLink;
};

type ConvertDecryptError = {
	error: {
		statusCode: number;
		statusName: string;
	};
};

/**
 * Convert and decrypt using the web API.
 */
export async function getConvertDecrypt(
	itemHref: string,
	targets: Settings["agentsInToolbar"],
): Promise<ConvertDecryptSuccess | ConvertDecryptError> {
	const url = new URL(Config.endpoint.convertDecrypt);
	url.searchParams.set("url", itemHref);
	url.searchParams.set("targets", ["raw", ...targets].join(","));
	try {
		const response = await cachedFetch(url.href);
		if (!response.ok) {
			const statusCode = response.status;
			const statusName = response.statusText || "Unknown Error";
			console.error("Failed to fetch convert-decrypt:", statusCode, statusName);
			return { error: { statusCode, statusName } };
		}
		const json = (await response.json()) as {
			data: Array<{ target: Agent; url: string }>;
			meta: CnLink;
		};
		return { data: json.data, cnLink: json.meta };
	} catch {
		return { error: { statusCode: 0, statusName: "Network Error" } };
	}
}
