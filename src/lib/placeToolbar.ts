import type { Agent } from 'cn-links';

import type { Settings } from '../models';
import { waitForElement } from './waitForElement';

export const agentsWhereStickyIsNotAStyle: Agent[] = ['hagobuy', 'cssbuy'];

export function placeToolbar(
  settings: Settings,
  body: HTMLBodyElement,
  elem: HTMLElement,
  agent?: Agent
) {
  if (agent === 'hagobuy') {
    // Select the target element with the class 'home-fixed'
    const query = 'header';
    waitForElement(query, (targetElement) => {
      // Check if the target element has a first child
      if (targetElement.firstChild) {
        // If there is a first child, insert the element before it
        targetElement.insertBefore(elem, targetElement.firstChild);
      } else {
        // If there is no first child, append the element to the target element
        targetElement.appendChild(elem);
      }
    });
    waitForElement('.item-page', (targetElement) => {
      console.log('target:', targetElement);
      const padding = document.createElement('div');
      padding.className = 'ra-ext-padding';
      padding.style.height = '48px';
      // Insert padding as the first child of targetElement
      if (targetElement.firstChild) {
        targetElement.insertBefore(padding, targetElement.firstChild);
      } else {
        targetElement.appendChild(padding); // Use appendChild if there are no other children
      }
    });
  } else if (agent === 'pandabuy' && settings.stickyToolbar) {
    // Select the target element with the class 'home-fixed'
    const query = '.global-content';
    waitForElement(query, (targetElement) => {
      // Check if the target element has a first child
      if (targetElement.firstChild) {
        // If there is a first child, insert the element before it
        targetElement.insertBefore(elem, targetElement.firstChild);
      } else {
        // If there is no first child, append the element to the target element
        targetElement.appendChild(elem);
      }
    });
  } else if (agent === 'cssbuy' && settings.stickyToolbar) {
    // Select the target element with the class 'home-fixed'
    const query = '#menuBar';
    waitForElement(query, (targetElement) => {
      // Check if the target element has a first child
      if (targetElement.firstChild) {
        // If there is a first child, insert the element before it
        targetElement.insertBefore(elem, targetElement.firstChild);
      } else {
        // If there is no first child, append the element to the target element
        targetElement.appendChild(elem);
      }
    });
  } else {
    body.insertAdjacentElement('afterbegin', elem);
  }
}
