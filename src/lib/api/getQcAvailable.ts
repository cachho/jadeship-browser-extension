import type { CnLink, Marketplace } from 'cn-links';

import { Config } from '../../Config';
import type { QcResponse } from '../../models';
import { fetchData } from './fetchData';

export const findqcMappings = new Map<Marketplace, string>([
  ['1688', 'T1688'],
  ['taobao', 'TB'],
  ['weidian', 'WD'],
  ['tmall', 'TB'],
]);

export function generateLink(link: CnLink): string {
  return `https://findqc.com/detail/${findqcMappings.get(link.marketplace)}/${
    link.id
  }`;
}

export async function getQcAvailable(
  cnLink: CnLink
): Promise<QcResponse | null> {
  const data = await fetchData(Config.host.qc, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: cnLink.id,
      marketplace: cnLink.marketplace,
    }),
  });
  return data;
}
