import { Config } from '../../Config';
import type { QcResponse } from '../../models';
import type { Marketplace } from '../../models/Marketplace';

/**
 * Get QC pictures
 */
export async function getQc(
  id: string,
  marketplace: Marketplace
): Promise<QcResponse | null> {
  const url = new URL(`${Config.endpoint.qc}/${marketplace}/${id}`);
  const response = await fetch(url.href);
  if (!response.ok) {
    console.error('Failed to fetch qc:', response.statusText);
    return null;
  }
  const { data } = await response.json();
  return data;
}
