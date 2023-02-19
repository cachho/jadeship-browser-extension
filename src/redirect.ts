// Get the storage API for the current browser
function getStorageRedirect():
  | typeof browser.storage
  | typeof chrome.storage
  | null {
  if (typeof browser !== 'undefined') {
    // Extension is running in Firefox
    return browser.storage;
  }
  if (typeof chrome !== 'undefined' && chrome.storage) {
    // Extension is running in Chrome or Chromium-based browser
    return chrome.storage;
  }
  // Storage API is not available
  console.error('Storage API is not available');
  return null;
}

function isChromeStorageRedirect(
  storage: any
): storage is typeof chrome.storage {
  return (
    typeof chrome !== 'undefined' &&
    chrome.storage &&
    storage === chrome.storage
  );
}

function getIsAllowed(
  storage: typeof browser.storage | typeof chrome.storage | null
): Promise<any> {
  return new Promise((resolve) => {
    if (storage) {
      if (isChromeStorageRedirect(storage)) {
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
  console.log('🚀 ~ file: redirect.ts:4 ~ getAgent ~ url', url);
  if (url === 'www.wegobuy.com' || url === 'login.wegobuy.com')
    return 'wegobuy';
  if (url === 'www.pandabuy.com') return 'pandabuy';
  if (url === 'www.superbuy.com' || url === 'login.superbuy.com')
    return 'superbuy';
  if (url === 'www.sugargoo.com' || url === 'sugargoo.com') return 'sugargoo';
  if (url === 'www.cssbuy.com') return 'cssbuy';
  return null;
}

async function getAffiliates(): Promise<Affiliate[] | null> {
  const storage = getStorageRedirect();

  // Check if affiliates feature is enabled
  const isAllowed = await getIsAllowed(storage);
  if (isAllowed !== true) {
    console.log('affiliates disabled');
    return null;
  }

  return new Promise((resolve) => {
    if (storage) {
      if (isChromeStorageRedirect(storage)) {
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

getAffiliates().then((affiliates) => {
  if (!affiliates) {
    return null;
  }
  window.addEventListener('DOMContentLoaded', () => {
    // Wait for the page to finish loading before redirecting.

    // Agent related
    const agent = getAgent(window.location.host);
    if (!agent) {
      return null;
    }
    const affiliate = affiliates.find((aff) => aff.name === agent);
    if (!affiliate) {
      return null;
    }
    console.log('🚀 ~ file: redirect.ts:111 ~ affiliate', affiliate);
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
  return true;
});
