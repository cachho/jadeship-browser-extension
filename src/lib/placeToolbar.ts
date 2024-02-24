import type { Agent } from 'cn-links';

import { waitForElement } from './waitForElement';

export function placeToolbar(
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
  }
  if (agent === 'pandabuy') {
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
  } else {
    body.insertAdjacentElement('afterbegin', elem);
  }
}
