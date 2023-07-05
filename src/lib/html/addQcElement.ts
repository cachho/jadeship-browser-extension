import type { CnLink } from 'cn-links';

export function addQcElement(cnLink: CnLink, link: HTMLAnchorElement) {
  const elem = document.createElement('a');
  elem.href = `https://qc.photos/?url=${cnLink.as('raw')}`;
  elem.target = '_blank';
  elem.rel = 'nofollow norefferer noopener';
  elem.textContent = '📷';
  elem.style.textDecoration = 'None';
  link.insertAdjacentElement('afterend', elem);
}
