import type { Agent } from '../models';

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
