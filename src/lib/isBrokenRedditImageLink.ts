import type { Platform } from '../models';

export function isBrokenRedditImageLink(
  current: string,
  platform: Platform
): boolean {
  // Reddit has this weird behavior where the slash in links in galleries are omitted and no https is added.
  // https://weidian.com/item.html?itemID=4381856414&spider_token=4572
  // turns into
  // weidian.comitem.h...

  // Check for agent links
  if (current.indexOf('pandabuy.comprod') !== -1) return true;

  if (platform === 'taobao') {
    return (
      current.indexOf('item.taobao.comitem') !== -1 ||
      current.indexOf('m.intl.taobao.comdetail') !== -1
    );
  }
  if (platform === 'weidian') {
    return (
      current.indexOf('weidian.comitem') !== -1 ||
      current.indexOf('weidian.comfast') !== -1
    );
  }
  if (platform === '1688') {
    return (
      current.indexOf('m.1688.com...') !== -1 ||
      current.indexOf('detail.1688.com...') !== -1
    );
  }
  if (platform === 'tmall') {
    return current.indexOf('detail.tmall.comitem') !== -1;
  }
  return false;
}
