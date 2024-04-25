import type { Settings } from '../models';

/**
 * Targeted hrefs are the links that the page is scanned for which are then converted.
 * @param settings
 * @returns
 */
export function getTargetHrefs(settings: Settings) {
  let targetedHrefs: string[] = [];

  if (settings.weidianLink) {
    targetedHrefs = targetedHrefs.concat([
      'weidian.com/item',
      'weidian.com/fastorder',
      'k.youshop10.com',
    ]);
  }

  if (settings.taobaoLink) {
    targetedHrefs = targetedHrefs.concat([
      'taobao.com/item',
      'm.intl.taobao.com/detail',
      'm.tb.cn',
    ]);
  }

  if (settings.s1688Link) {
    targetedHrefs = targetedHrefs.concat([
      // "qr.1688.com/s",
      'm.1688.com/offer',
      'detail.1688.com/offer',
      'qr.1688.com/s/',
    ]);
  }

  if (settings.tmallLink) {
    targetedHrefs = targetedHrefs.concat([
      'detail.tmall.com/item',
      'item.tmall.com/item',
    ]);
  }

  if (settings.agentLink) {
    targetedHrefs = targetedHrefs.concat([
      'wegobuy.com/en/page/buy',
      'superbuy.com/en/page/buy',
      'allchinabuy.com/en/page/buy',
      'wegobuy.com/cn/page/buy',
      'superbuy.com/cn/page/buy',
      'allchinabuy.com/cn/page/buy',
      'm.superbuy.com',
      'pandabuy.com/product',
      'pandabuy.page.link',
      'pandabuy.allapp.link',
      'sugargoo.com/#/home/productDetail',
      'sugargoo.com/index/item',
      'cssbuy.com/item',
      'hagobuy.com/item',
      'weidian.info',
      'kameymall.com/purchases/search',
      'cnfans.com/product',
      'hoobuy.com/product',
      'ezbuycn.com/api',
    ]);
  }

  return targetedHrefs;
}
