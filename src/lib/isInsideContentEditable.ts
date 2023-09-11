export function isInsideContentEditable(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }
  if (element.isContentEditable) {
    return true;
  }
  return isInsideContentEditable(element.parentElement);
}
