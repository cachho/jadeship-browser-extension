import type { ApiResponse, Platform } from '../../models';
import type { Details } from '../../models/Details';
import { fetchData } from './fetchData';

export async function getDetails(
  platform: Platform,
  id: string
): Promise<ApiResponse<Details> | null> {
  const d = await fetchData(
    `https://api.reparchive.com/livefeed/details/item/${platform}/${id}`
  );
  return d;
}
