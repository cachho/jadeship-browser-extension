import { generateProperLink } from './generateProperLink';

export function decryptCssbuy(link: HTMLAnchorElement): URL | null {
  if (link.pathname.startsWith('/item-micro')) {
    const id = link.pathname.split('-')[2].split('.')[0];
    if (id) {
      return new URL(generateProperLink('weidian', id));
    }
  }
  if (link.pathname.startsWith('/item-1688')) {
    const id = link.pathname.split('-')[2].split('.')[0];
    if (id) {
      return new URL(generateProperLink('1688', id));
    }
  }
  if (link.pathname.startsWith('/item')) {
    const id = link.pathname.split('-')[1].split('.')[0];
    if (id) {
      return new URL(generateProperLink('taobao', id));
    }
  }
  return null;
}
