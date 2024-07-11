export function isConvertableLink(url: URL): boolean {
  const convertableLinks = [
    'pandabuy.page.link',
    'pandabuy.allapp.link',
    'k.youshop10.com',
    'm.tb.cn',
    'qr.1688.com',
    'tinyurl.com',
    'weidian.info',
    'hoobuy.cc',
    'l.acbuy.com',
  ] as const;

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
