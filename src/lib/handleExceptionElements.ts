import type { Agent, Platform } from '../models';

/**
 * This is where exceptions go, parts of the original site that have to be handled,
 * like banners that they put at position top: 0.
 * @param agent { Agent | null } Optional. Current agent.
 */
export function handleExceptionElements(agent?: Agent | null) {
  if (agent === 'cssbuy') {
    const otherElements = document.getElementsByClassName('nav_11');
    Array.from(otherElements).forEach((otherElement: Element) => {
      // eslint-disable-next-line no-param-reassign
      (otherElement as HTMLElement).style.top = '48px';
    });
  }
}

export function undoExceptionElements(
  agent?: Agent | null
  // platform?: Platform | null
) {
  if (agent === 'cssbuy') {
    const otherElements = document.getElementsByClassName('nav_11');
    Array.from(otherElements).forEach((otherElement: Element) => {
      // eslint-disable-next-line no-param-reassign
      (otherElement as HTMLElement).style.top = '0px';
    });
  }
}

export function addObserver(platform?: Platform | null) {
  if (!platform || platform !== 'weidian') {
    return null;
  }
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        if (platform === 'weidian') {
          // Hide Top Bar
          const element = document.getElementById('topBar');
          if (element) {
            element.style.display = 'none';
            // Optionally, you can stop observing once the element is found and hidden
            observer.disconnect();
          }
          // Remove padding from itemHeaderBox
          const itemHeaderBox = document.getElementById('itemHeaderBox');
          if (itemHeaderBox) {
            itemHeaderBox.style.paddingTop = '0px';
          }
        }
      }
    });
  });
  return observer;
}
