import type { QcAvailable } from '../models';

export function addQcElement(
  qcAvailable: QcAvailable,
  link: HTMLAnchorElement
) {
  const elem = document.createElement('a');
  elem.href = qcAvailable.link;
  elem.target = '_blank';
  elem.rel = 'nofollow norefferer noopener';
  elem.textContent = '📷';
  elem.style.textDecoration = 'None';
  link.insertAdjacentElement('afterend', elem);
}
