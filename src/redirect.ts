import { getStorage, isChromeStorage } from './lib/storage';
import type { Affiliate, Agent } from './models';

function getIsAllowed(
  storage: typeof browser.storage | typeof chrome.storage | null
): Promise<any> {
  return new Promise((resolve) => {
    if (storage) {
      if (isChromeStorage(storage)) {
        storage.local.get('affiliateProgram', (aff) => {
          resolve(aff?.affiliateProgram);
        });
      } else {
        storage.local.get('affiliateProgram').then((aff) => {
          resolve(aff?.affiliateProgram);
        });
      }
    } else {
      console.error('No storage available');
      resolve(null);
    }
  });
}

// function getAllFromLocalStorage(
//   storage: typeof browser.storage | typeof chrome.storage | null
// ) {
//   if (storage) {
//     if (isChromeStorageRedirect(storage)) {
//       storage.local.get(null, (ls) => {
//         console.log('🚀 ~ file: redirect.ts:57 ~ storage.local.get ~ ls', ls);
//       });
//     } else {
//       storage.local.get({}).then((ls) => {
//         console.log('🚀 ~ file: redirect.ts:61 ~ storage.local.get ~ ls', ls);
//       });
//     }
//   } else {
//     console.error('No storage available');
//   }
// }

function getAgent(url: string): Agent | null {
  if (
    url === 'www.wegobuy.com' ||
    url === 'wegobuy.com' ||
    url === 'login.wegobuy.com'
  )
    return 'wegobuy';
  if (url === 'www.pandabuy.com' || url === 'pandabuy.com') return 'pandabuy';
  if (
    url === 'www.superbuy.com' ||
    url === 'superbuy.com' ||
    url === 'login.superbuy.com'
  )
    return 'superbuy';
  if (url === 'www.sugargoo.com' || url === 'sugargoo.com') return 'sugargoo';
  if (url === 'www.cssbuy.com' || url === 'cssbuy.com') return 'cssbuy';
  return null;
}

function validateRegisterPage(agent: Agent, location: Location): boolean {
  if (agent === 'pandabuy') {
    return location.pathname === '/login/';
  }
  if (agent === 'superbuy' || agent === 'wegobuy') {
    const params = new URLSearchParams(location.search);
    return (
      (location.pathname === '/en/page/login/' ||
        location.pathname === '/cn/page/login/') &&
      params.get('type') === 'register'
    );
  }
  if (agent === 'cssbuy') {
    const params = new URLSearchParams(location.search);
    return location.pathname === '/' && params.get('action') === 'register';
  }
  if (agent === 'sugargoo') {
    return location.pathname.indexOf('/index/user/register') !== -1;
  }
  return false;
}

async function getAffiliates(): Promise<Affiliate[] | null> {
  const storage = getStorage();

  // Check if affiliates feature is enabled
  const isAllowed = await getIsAllowed(storage);
  if (isAllowed !== true) {
    return null;
  }

  return new Promise((resolve) => {
    if (storage) {
      if (isChromeStorage(storage)) {
        storage.local.get('affiliate', (aff) => {
          const { affiliate } = aff;
          resolve(affiliate);
        });
      } else {
        storage.local.get('affiliate').then((aff) => {
          const { affiliate } = aff;
          resolve(affiliate);
        });
      }
    } else {
      console.error('No storage available');
      resolve(null);
    }
  });
}

function redirect() {
  getAffiliates().then((affiliates) => {
    if (!affiliates) {
      return null;
    }

    //   window.addEventListener('DOMContentLoaded', () => {
    // Wait for the page to finish loading before redirecting.
    // NOTE: The DomContentLoaded method quit working with the new
    // manifest, so I removed it. However, I'm sure there's a reason
    // I used it in the first place

    // Agent related
    const agent = getAgent(window.location.host);
    if (!agent) {
      return null;
    }

    if (!validateRegisterPage(agent, window.location)) {
      return null;
    }

    const affiliate = affiliates.find((aff) => aff.name === agent);
    if (!affiliate) {
      return null;
    }
    // Get Url Parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Switch between agents that use url parameters and those who use url paths
    if (affiliate.param && affiliate.param !== '' && affiliate.ref) {
      if (urlParams.get(affiliate.param) !== affiliate.ref) {
        // Check if not already applied
        urlParams.set(affiliate.param, affiliate.ref);
        window.location.search = urlParams.toString();
      }
    } else if (affiliate.ref && affiliate.param === '') {
      // Check if not already applied
      if (window.location.href !== affiliate.url) {
        window.location.href = affiliate.url;
      }
    }
    return true;
  });
}

redirect();
