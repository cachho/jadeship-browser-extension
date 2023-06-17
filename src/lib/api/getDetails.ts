import type { CnLink } from 'cn-links';

import type { ApiResponse } from '../../models';
import type { Details } from '../../models/Details';
import { fetchData } from './fetchData';

export async function getDetails(
  cnLink: CnLink
): Promise<ApiResponse<Details> | null> {
  const d = await fetchData(
    `https://api.reparchive.com/livefeed/details/item/${cnLink.marketplace}/${cnLink.id}`
  );
  return d;
}
