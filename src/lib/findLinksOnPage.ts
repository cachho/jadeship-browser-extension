import type { Settings } from '../models';

export function findLinksOnPage(settings: Settings) {
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
      'm.superbuy.com',
      'pandabuy.com/product',
      'pandabuy.page.link',
      'pandabuy.allapp.link',
      'sugargoo.com/#/home/productDetail',
      'sugargoo.com/index/item',
      'cssbuy.com/item',
      'hagobuy.com/item',
    ]);
  }

  function isInsideContentEditable(element: HTMLElement | null): boolean {
    if (!element) {
      return false;
    }
    if (element.isContentEditable) {
      return true;
    }
    return isInsideContentEditable(element.parentElement);
  }

  const links = Array.from(
    document.querySelectorAll('a')
  ) as HTMLAnchorElement[];

  return links
    .filter((a) => !isInsideContentEditable(a))
    .filter((a) => targetedHrefs.some((href) => a.href.indexOf(href) !== -1))
    .filter((a) => a.dataset.reparchiveExtension !== 'true')
    .filter((a) => !a.href.startsWith('https://qc.photos'));
}
