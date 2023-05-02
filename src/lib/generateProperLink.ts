import type { Platform } from '../models';

export function generateProperLink(platform: Platform, id: string): string {
  if (platform === 'weidian') {
    const urlParams = new URLSearchParams();
    urlParams.set('itemID', id);
    return `https://weidian.com/item.html?${urlParams.toString()}`;
  }
  if (platform === 'taobao') {
    const urlParams = new URLSearchParams();
    urlParams.set('id', id);
    return `https://item.taobao.com/item.html?${urlParams.toString()}`;
  }
  if (platform === '1688') {
    // https://detail.1688.com/offer/669220179358.html
    return `https://detail.1688.com/offer/${id}.html`;
  }
  if (platform === 'tmall') {
    const urlParams = new URLSearchParams();
    urlParams.set('id', id);
    return `https://detail.tmall.com/item_o.htm?${urlParams.toString()}`;
  }
  return '';
}
