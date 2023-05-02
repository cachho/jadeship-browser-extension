import type { Settings } from './models/Settings';
import { defaultSettings } from './models/Settings';

/**
 * This script initializes local storage with default values and from the api.
 * @returns void
 */
function initializeExtension() {
  function getStorage(): typeof browser.storage | typeof chrome.storage | null {
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

  function isChromeStorage(storage: any): storage is typeof chrome.storage {
    return (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      storage === chrome.storage
    );
  }

  const storage = getStorage();
  // Check if we're running in Chrome
  if (storage && isChromeStorage(storage)) {
    Object.keys(defaultSettings).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
        const params: { [key: string]: any } = {};
        params[key] = null;
        storage.local.get(params, (result) => {
          if (
            !Object.prototype.hasOwnProperty.call(result, key) ||
            !result[key]
          ) {
            const defaultVal = defaultSettings[key as keyof Settings];
            storage.local.set({ [key]: defaultVal });
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

  async function fetchData(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  if (storage) {
    // Only get links if online features are enabled.
    if (isChromeStorage(storage)) {
      storage.local.get('onlineFeatures', (onlineFeatures) => {
        if (onlineFeatures.onlineFeatures) {
          fetchData('https://api.ch-webdev.com/affiliate-links')
            .then((response) => storage.local.set({ affiliate: response.data }))
            .catch((error) => console.error('Error fetching data:', error));
        }
      });
    } else {
      storage.local
        .get()
        .then((onlineFeatures) => {
          if (onlineFeatures.onlineFeatures) {
            fetchData('https://api.ch-webdev.com/affiliate-links')
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

initializeExtension();
