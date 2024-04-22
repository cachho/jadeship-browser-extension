import { detectAgent } from 'cn-links';

import { getAffiliates } from './lib/getAffiliates';
import { validateRegisterPage } from './lib/validateRegisterPage';

/**
 * Redirect can run as a content script or be injected through a browser api listener.
 * The first former does not work with client side navigation, which the agents use.
 */
function redirect() {
  getAffiliates()
    .then((affiliates) => {
      if (!affiliates) {
        return null;
      }

      //   window.addEventListener('DOMContentLoaded', () => {
      // Wait for the page to finish loading before redirecting.
      // NOTE: The DomContentLoaded method quit working with the new
      // manifest, so I removed it. However, I'm sure there's a reason
      // I used it in the first place

      // Agent related
      const agent = detectAgent(window.location.href);
      if (!agent) {
        return null;
      }

      const url = new URL(window.location.href);

      if (agent === 'sugargoo') {
        url.hash = '';
      }

      if (!validateRegisterPage(agent, url)) {
        return null;
      }

      const affiliate = affiliates[agent];

      // Switch between agents that use url parameters and those who use url paths
      if (
        affiliate.signupLink &&
        affiliate.signupLink !== window.location.href
      ) {
        window.location.href = affiliate.signupLink;
      }
      return true;
    })
    .catch((error) => {
      console.error(error);
    });
}

redirect();
