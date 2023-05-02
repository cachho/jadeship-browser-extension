export function buildExpandingImageElement(
  link: HTMLAnchorElement,
  src: string
) {
  // Experimental
  const imageContainer = document.createElement('div');
  imageContainer.style.position = 'relative';
  imageContainer.style.display = 'inline-block';
  imageContainer.style.verticalAlign = 'middle';

  const imageElement = document.createElement('img');
  imageElement.src = src;
  imageElement.style.display = 'block';
  imageElement.style.width = '16px';
  imageElement.style.height = '16px';
  imageElement.style.marginLeft = '0.3rem';
  imageElement.style.padding = '1px';

  imageContainer.appendChild(imageElement);

  const expandedImageElement = document.createElement('img');
  expandedImageElement.src = src;
  expandedImageElement.style.display = 'none';
  expandedImageElement.style.position = 'absolute';
  expandedImageElement.style.right = '0';
  expandedImageElement.style.left = 'auto';
  expandedImageElement.style.top = '0';
  expandedImageElement.style.bottom = 'auto';
  expandedImageElement.style.width = '320px';
  expandedImageElement.style.height = '320px';
  expandedImageElement.style.zIndex = '1';

  imageContainer.appendChild(expandedImageElement);

  // Add the image container to the DOM before or after the link
  link.parentNode?.insertBefore(imageContainer, link.nextSibling);

  // Add hover effect to expand the image
  imageContainer.addEventListener('mouseenter', () => {
    expandedImageElement.style.display = 'block';
    const { parentNode } = imageContainer;
    if (!parentNode) return;
    const parentRect = (parentNode as HTMLElement).getBoundingClientRect();
    const expandedImageRect = expandedImageElement.getBoundingClientRect();
    if (expandedImageRect.right > parentRect.right) {
      expandedImageElement.style.right = 'auto';
      expandedImageElement.style.left = '0';
    }
    if (expandedImageRect.bottom > parentRect.bottom) {
      expandedImageElement.style.top = 'auto';
      expandedImageElement.style.bottom = '0';
    }
  });

  imageContainer.addEventListener('mouseleave', () => {
    expandedImageElement.style.display = 'none';
  });

  return imageContainer;
}
