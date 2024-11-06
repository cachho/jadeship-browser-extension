import { convertableLinks } from '../data/convertableLinks';

export function isConvertableLink(url: URL): boolean {
  if (
    convertableLinks.some((convertableLink) =>
      url.hostname.includes(convertableLink)
    )
  )
    return true;
  if (
    (url.hostname === 'www.pandabuy.com' || url.hostname === 'pandabuy.com') &&
    url.pathname === '/product' &&
    url.searchParams.get('url')
  ) {
    const pattern = /^PI\d+$/;
    return pattern.test(url.searchParams.get('url')!);
  }
  return false;
}
