import type { ApiResponse, Settings } from '../models';
import { fetchData } from './api/fetchData';
import { decryptCssbuy } from './decryptCssbuy';

export async function handleShortenedLink(
  link: HTMLAnchorElement,
  settings: Settings
): Promise<URL | null> {
  if (link.hostname === 'pandabuy.page.link' && settings.onlineFeatures) {
    const url = `https://api.reparchive.com/convert-pandabuy${link.pathname}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  } else if (link.hostname === 'qr.1688.com' && settings.onlineFeatures) {
    const url = `https://api.ch-webdev.com/convert-1688/${link.pathname.slice(
      3
    )}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  } else if (
    link.hostname === 'cssbuy.com' ||
    link.hostname === 'www.cssbuy.com'
  ) {
    const decryptedCssbuy = decryptCssbuy(link);
    if (decryptedCssbuy) {
      // eslint-disable-next-line no-param-reassign
      link.href = decryptedCssbuy.href;
      return decryptedCssbuy;
    }
  }
  return null;
}
