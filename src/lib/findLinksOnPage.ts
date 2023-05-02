import type { Settings } from '../models';

export function findLinksOnPage(settings: Settings) {
  let targetedHrefs: string[] = [];

  if (settings.weidianLink) {
    targetedHrefs = targetedHrefs.concat([
      'weidian.com/item',
      'weidian.com/fastorder',
    ]);
  }

  if (settings.taobaoLink) {
    targetedHrefs = targetedHrefs.concat([
      'taobao.com/item',
      'm.intl.taobao.com/detail',
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
      'sugargoo.com/index/item',
      'cssbuy.com/item',
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

  const links = Array.from(document.querySelectorAll('a')).filter(
    (a) => !isInsideContentEditable(a)
  ) as HTMLAnchorElement[];

  return links
    .filter((a) => targetedHrefs.some((href) => a.href.indexOf(href) !== -1))
    .filter((a) => a.dataset.reparchiveExtension !== 'true');
}
