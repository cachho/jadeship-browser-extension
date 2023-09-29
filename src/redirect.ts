import { detectAgent } from 'cn-links';

import { getAffiliates } from './lib/getAffiliates';
import { validateRegisterPage } from './lib/validateRegisterPage';

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

      const affiliate = affiliates.find((aff) => aff.name === agent);
      if (!affiliate) {
        return null;
      }

      // Switch between agents that use url parameters and those who use url paths
      if (affiliate.param && affiliate.param !== '' && affiliate.ref) {
        if (url.searchParams.get(affiliate.param) !== affiliate.ref) {
          // Check if not already applied
          url.searchParams.set(affiliate.param, affiliate.ref);
          window.location.search = url.searchParams.toString();
        }
      } else if (affiliate.ref && affiliate.param === '') {
        // Check if not already applied
        if (window.location.href !== affiliate.url) {
          window.location.href = affiliate.url;
        }
      }
      return true;
    })
    .catch((error) => {
      console.error(error);
    });
}

redirect();
