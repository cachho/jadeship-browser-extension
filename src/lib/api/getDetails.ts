import type { CnLink } from 'cn-links';

import { Config } from '../../Config';
import type { ApiResponse } from '../../models';
import type { Details } from '../../models/Details';
import { fetchData } from './fetchData';

export async function getDetails(
  cnLink: CnLink
): Promise<ApiResponse<Details> | null> {
  const d = await fetchData(
    `${Config.host.details}/api/feed/details/${cnLink.marketplace}/${cnLink.id}`
  );
  return d;
}
