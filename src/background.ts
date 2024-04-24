import { Config } from './Config';
import { fetchData } from './lib/api/fetchData';
import { getAffiliates } from './lib/getAffiliates';
import { setAffiliateCookies } from './lib/setAffiliateCookies';
import { getStorage, isChromeStorage } from './lib/storage';
import type { Settings } from './models/Settings';
import { defaultSettings } from './models/Settings';

/**
 * This script initializes local storage with default values and from the api.
 * @returns void
 */
function initializeExtension(
  storage: typeof browser.storage | typeof chrome.storage | null
) {
  // Check if we're running in Chrome
  if (storage && isChromeStorage(storage)) {
    Object.keys(defaultSettings).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
        const param: { [key: string]: any } = { [key]: null };
        storage.local.get(param, (result) => {
          // Only proceed if the previous local storage does not have the key
          if (
            !Object.prototype.hasOwnProperty.call(result, key) ||
            result[key] === undefined
          ) {
            const defaultVal = defaultSettings[key as keyof Settings];
            storage.local.set({ [key]: defaultVal });
            storage.local.get(param, (r) => {
              if (r[key] !== defaultVal) {
                console.error(`Setting unsuccessful: ${r[key]} ${defaultVal}`);
              }
            });
          }
        });
      }
    });
  }

  // Check if we're running in Firefox
  if (storage && !isChromeStorage(storage)) {
    Object.keys(defaultSettings).forEach((key) => {
      const params: { [key: string]: any } = {};
      params[key] = null;
      storage.local.get(params).then((result) => {
        if (
          !Object.prototype.hasOwnProperty.call(result, key) ||
          !result[key]
        ) {
          const defaultVal = defaultSettings[key as keyof Settings];
          storage.local.set({ [key]: defaultVal });
        }
      });
    });
  }

  if (storage) {
    // Only get links if online features are enabled.
    if (isChromeStorage(storage)) {
      storage.local.get('onlineFeatures', (onlineFeatures) => {
        if (onlineFeatures.onlineFeatures) {
          fetchData(Config.endpoint.affiliateLinks)
            .then((response) => storage.local.set({ affiliate: response.data }))
            .catch((error) => console.error('Error fetching data:', error));
        }
      });
    } else {
      storage.local
        .get()
        .then((onlineFeatures) => {
          if (onlineFeatures.onlineFeatures) {
            fetchData(Config.endpoint.affiliateLinks)
              .then((response) =>
                storage.local.set({ affiliate: response.data })
              )
              .catch((error) => console.error('Error fetching data:', error));
          }
        })
        .catch((error) => console.error('Error retrieving data:', error));
    }
  }
}

function main() {
  const storage = getStorage();
  initializeExtension(storage);
  // addRedirectListener(isChromeStorage(storage));
  getAffiliates().then((affiliates) => {
    if (affiliates) {
      setAffiliateCookies(isChromeStorage(storage), affiliates);
    }
  });
}

main();
