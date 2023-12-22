import type { CnLink } from 'cn-links';

import { Config } from '../../Config';
import type { QcAvailable } from '../../models';
import { fetchData } from './fetchData';

export async function getQcAvailable(
  cnLink: CnLink
): Promise<QcAvailable | null> {
  const link = encodeURIComponent(cnLink.as('raw').href);
  const url = `${Config.host.qc}/v3/checkIfProductHasQcImages?url=${link}`;
  const d = await fetchData(url);
  return d;
}
