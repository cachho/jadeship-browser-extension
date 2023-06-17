import type { CnLink } from 'cn-links';

import type { QcAvailable } from '../../models';
import { fetchData } from './fetchData';

export async function getQcAvailable(
  cnLink: CnLink
): Promise<QcAvailable | null> {
  const link = encodeURIComponent(cnLink.as('raw').href);
  const url = `https://product2.rep.ninja/checkforqc?key=reparchiveqctest&url=${link}`;
  const d = await fetchData(url);
  return {
    ...d,
    link: `https://qc.photos/?url=${link}`,
  };
}
