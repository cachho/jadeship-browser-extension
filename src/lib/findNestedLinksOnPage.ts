/* eslint-disable no-param-reassign */
import { thirdParties } from '../models/3rdParty';
import { getDomain } from './getDomain';
import { isInsideContentEditable } from './isInsideContentEditable';

export function findNestedLinksOnPage() {
  const links = Array.from(
    document.querySelectorAll('a')
  ) as HTMLAnchorElement[];

  const filteredLinks = links.filter((a) => !isInsideContentEditable(a));

  return filteredLinks.reduce((acc, elem) => {
    try {
      const thirdPartyPage = thirdParties.find(
        (thirdParty) => thirdParty === getDomain(new URL(elem.href))
      );
      if (thirdPartyPage) {
        const url = new URL(elem.href);
        if (thirdPartyPage === 'yupoo.com' && url.pathname === '/external') {
          const innerLink = url.searchParams.get('url');
          if (innerLink) {
            elem.href = new URL(decodeURIComponent(innerLink)).href;
            elem.dataset.reparchiveExtensionNested = 'true';
            acc.push(elem);
          }
        }
      }
    } catch {
      /* empty */
    }

    return acc;
  }, [] as HTMLAnchorElement[]);
}
