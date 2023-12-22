import { isInsideContentEditable } from './isInsideContentEditable';

export function findLinksOnPage(targetedHrefs: string[]) {
  const links = Array.from(
    document.querySelectorAll('a')
  ) as HTMLAnchorElement[];

  return links
    .filter((a) => !isInsideContentEditable(a))
    .filter((a) => targetedHrefs.some((href) => a.href.indexOf(href) !== -1))
    .filter(
      (a) =>
        a.dataset.CnLinkExtension !== 'true' &&
        a.dataset.CnLinkExtensionNested !== 'true'
    )
    .filter((a) => !a.href.startsWith('https://qc.photos'));
}
