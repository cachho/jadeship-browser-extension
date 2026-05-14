export function addQcElement(qcUrl: string, link: HTMLAnchorElement) {
  const elem = document.createElement('a');
  elem.href = qcUrl;
  elem.target = '_blank';
  elem.rel = 'nofollow norefferer noopener';
  elem.textContent = '📷';
  elem.style.textDecoration = 'None';
  link.insertAdjacentElement('afterend', elem);
}
