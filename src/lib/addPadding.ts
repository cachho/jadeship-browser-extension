export function addPadding(targetElement: Element, height = '48px') {
  const padding = document.createElement('div');
  padding.className = 'ra-ext-padding';
  padding.style.height = height;
  // Insert padding as the first child of targetElement
  if (targetElement.firstChild) {
    targetElement.insertBefore(padding, targetElement.firstChild);
  } else {
    targetElement.appendChild(padding); // Use appendChild if there are no other children
  }
}
