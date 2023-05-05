export function addDetailsElement(text: string, nowrap?: boolean) {
  const elem = document.createElement('span');
  elem.style.backgroundColor = '#2bb675';
  elem.style.color = 'white';
  elem.style.paddingLeft = '3px';
  elem.style.paddingRight = '3px';
  elem.style.paddingTop = '1px';
  elem.style.paddingBottom = '1px';
  elem.style.marginLeft = '0.3rem';
  elem.textContent = text;
  if (nowrap) {
    elem.style.display = 'inline-block';
    elem.style.whiteSpace = 'nowrap';
  }
  return elem;
}
