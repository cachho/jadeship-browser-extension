import { Config } from '../Config';
import type { Settings } from '../models';
import { fetchData } from './api/fetchData';
import { isConvertableLink } from './isConvertableLink';

export async function handleShortenedLink(
  link: HTMLAnchorElement,
  settings: Settings
): Promise<URL | null> {
  if (!settings.onlineFeatures) {
    return null;
  }
  if (isConvertableLink(new URL(link.href))) {
    const data = await fetchData(
      `${Config.host.shortenedLinks}/convert?url=${encodeURIComponent(
        link.href
      )}`
    );
    if (data?.data) {
      return new URL(data.data);
    }
  }
  return null;
}
