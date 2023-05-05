import type { Platform } from '../models';

export function buildPlatformNativeLink(
  platform: Platform,
  id: string
): string | null {
  if (platform === 'taobao') {
    return `https://item.taobao.com/item.html?id=${id}`;
  }
  if (platform === 'weidian') {
    return `https://weidian.com/item.html?itemID=${id}`;
  }
  if (platform === '1688') {
    return `https://detail.1688.com/offer/${id}.html`;
  }
  if (platform === 'tmall') {
    return `https://detail.tmall.com/item_o.htm?id=${id}`;
  }
  return null;
}
