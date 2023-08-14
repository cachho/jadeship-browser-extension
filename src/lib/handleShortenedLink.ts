import type { ApiResponse, Settings } from '../models';
import { fetchData } from './api/fetchData';

export async function handleShortenedLink(
  link: HTMLAnchorElement,
  settings: Settings
): Promise<URL | null> {
  if (
    (link.hostname === 'pandabuy.page.link' ||
      link.hostname === 'pandabuy.allapp.link') &&
    settings.onlineFeatures
  ) {
    const url = `https://api.reparchive.com/convert/pandabuy?url=${encodeURIComponent(
      link.href
    )}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  } else if (link.hostname === 'qr.1688.com' && settings.onlineFeatures) {
    const url = `https://api.reparchive.com/convert/1688/${link.pathname.slice(
      3
    )}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  } else if (link.hostname === 'k.youshop10.com' && settings.onlineFeatures) {
    const url = `https://api.reparchive.com/convert/kyoushop${link.pathname}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  } else if (link.hostname === 'm.tb.cn' && settings.onlineFeatures) {
    const url = `https://api.reparchive.com/convert/taobao${link.pathname}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  }
  return null;
}
