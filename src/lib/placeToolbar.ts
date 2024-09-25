import type { Agent } from 'cn-links';

import type { Settings } from '../models';
import { addPadding } from './addPadding';
import { waitForElement } from './waitForElement';

export const agentsWhereStickyIsNotAStyle: Agent[] = ['hagobuy'];

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
      addPadding(targetElement);
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
  } else if (agent === 'panglobalbuy') {
    const query = '.header_warp';
    waitForElement(query, (targetElement) => {
      // Check if the target element has a first child
      if (targetElement.firstChild) {
        // If there is a first child, insert the element before it
        targetElement.insertBefore(elem, targetElement.firstChild);
      } else {
        // If there is no first child, append the element to the target element
        targetElement.appendChild(elem);
      }
      addPadding(targetElement, '60px');
    });
  } else if (agent === 'hegobuy') {
    const query = '.home-fixed';
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
