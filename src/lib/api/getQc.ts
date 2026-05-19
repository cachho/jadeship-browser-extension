import { Config } from "../../Config";
import type { QcResponse } from "../../models";
import type { Marketplace } from "../../models/Marketplace";
import { cachedFetch } from "./cachedFetch";

/**
 * Get QC pictures
 */
export async function getQc(
	id: string,
	marketplace: Marketplace,
): Promise<QcResponse | null> {
	const url = new URL(`${Config.endpoint.qc}/${marketplace}/${id}`);
	const response = await cachedFetch(url.href);
	if (!response.ok) {
		console.error("Failed to fetch qc:", response.statusText);
		return null;
	}
	const json = (await response.json()) as { data?: QcResponse };
	return json.data ?? null;
}
