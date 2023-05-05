export function extractInnerLink(link: HTMLAnchorElement | URL): URL | null {
  const urlParams = new URLSearchParams(link.search ?? link);
  const innerParam = urlParams.get('url');
  if (!innerParam) {
    return null;
  }
  const innerLink = new URL(innerParam);
  if (innerLink) {
    return innerLink;
  }
  return null;
}
