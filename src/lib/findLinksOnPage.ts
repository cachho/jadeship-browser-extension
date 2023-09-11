export function findLinksOnPage(targetedHrefs: string[]) {
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
