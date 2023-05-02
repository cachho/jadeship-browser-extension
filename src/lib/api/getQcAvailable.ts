import type { Platform, QcAvailable } from '../../models';
import { buildPlatformNativeLink } from '../buildPlatformNativeLink';
import { fetchData } from './fetchData';

export async function getQcAvailable(
  platform: Platform,
  id: string
): Promise<QcAvailable | null> {
  const link = buildPlatformNativeLink(platform, id);
  if (!link) {
    return null;
  }
  const url = `https://product2.rep.ninja/checkforqc?key=reparchiveqctest&url=${encodeURIComponent(
    link
  )}`;
  const d = await fetchData(url);
  return {
    ...d,
    link: `https://qc.photos/?url=${encodeURIComponent(link)}`,
  };
}
