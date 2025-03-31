import type { CnLink } from 'cn-links';

import { generateLink } from '../api/getQcAvailable';

export function addQcElement(cnLink: CnLink, link: HTMLAnchorElement) {
  const elem = document.createElement('a');
  const url = new URL(generateLink(cnLink));
  url.searchParams.set('url', cnLink.as('raw').href);
  elem.href = url.href;
  elem.target = '_blank';
  elem.rel = 'nofollow norefferer noopener';
  elem.textContent = '📷';
  elem.style.textDecoration = 'None';
  link.insertAdjacentElement('afterend', elem);
}
