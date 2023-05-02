import type { Platform } from '../models';

export function extractId(platform: Platform, link: string) {
  const url = new URL(link);
  const urlParams = new URLSearchParams(url.search ?? link);
  // For regular Taobao and Weidian Links
  if (platform === 'weidian') {
    if (urlParams.get('itemID')) {
      return urlParams.get('itemID');
    }
    if (urlParams.get('itemId')) {
      return urlParams.get('itemId');
    }
  } else if (platform === 'taobao') {
    if (link.indexOf('world.taobao.com') !== -1) {
      const id = link.split('item/')[1].split('.')[0];
      if (!Number.isNaN(Number(id))) {
        return id;
      }
    }
    if (urlParams.get('id')) {
      return urlParams.get('id');
    }
  } else if (platform === '1688') {
    // If it's still shortened at this point it can't be saved.
    if (link.indexOf('qr.1688.com') !== -1) {
      return null;
    }
    // 1688 doesn't use urlParams
    if (link.indexOf('offer')) {
      const id =
        link.indexOf('offer/') !== -1
          ? link.split('offer/')[1].split('.')[0]
          : link.split('offer%2F')[1].split('.')[0];
      // Validate number
      if (!Number.isNaN(Number(id))) {
        return id;
      }
    }
  } else if (platform === 'tmall') {
    if (urlParams.get('id')) {
      return urlParams.get('id');
    }
  }
  return null;
}
