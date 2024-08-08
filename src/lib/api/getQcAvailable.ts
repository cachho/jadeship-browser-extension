import type { CnLink, Marketplace } from 'cn-links';

import { Config } from '../../Config';
import type { QcResponse } from '../../models';
import { fetchData } from './fetchData';

export const findslyMappings = new Map<Marketplace, string>([
  ['1688', 'ONE_SIX_EIGHT_EIGHT'],
  ['taobao', 'TAOBAO'],
  ['weidian', 'WEIDIAN'],
  ['tmall', 'TAOBAO'],
]);

export async function getQcAvailable(
  cnLink: CnLink
): Promise<QcResponse | null> {
  const url = `${Config.host.qc}/products/${findslyMappings.get(
    cnLink.marketplace
  )}/${cnLink.id}/qcPhotos`;
  const d = await fetchData(url);
  return d;
}
