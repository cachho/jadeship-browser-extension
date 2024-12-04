import { Config } from '../Config';
import type { Settings } from '../models/Settings';
import { defaultSettings } from '../models/Settings';
import { fetchData } from './api/fetchData';
import { isChromeStorage } from './storage';

/**
 * This script initializes local storage with default values and from the api.
 * @returns void
 */
export async function initializeExtension(
  storage: typeof browser.storage | typeof chrome.storage | null
) {
  if (!storage) {
    console.error('Storage is not available.');
    return;
  }
  // Check if we're running in Chrome
  if (isChromeStorage(storage)) {
    Object.keys(defaultSettings).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
        const param: { [key: string]: any } = { [key]: null };
        storage.local.get(param, (result) => {
          // Only proceed if the previous local storage does not have the key
          if (
            !Object.prototype.hasOwnProperty.call(result, key) ||
            result[key] === undefined ||
            result[key] === null
          ) {
            const defaultVal = defaultSettings[key as keyof Settings];
            console.debug(
              `Key does not exist. Creating key '${key}' with value: ${defaultVal}`
            );
            storage.local.set({ [key]: defaultVal });
            storage.local.get(param, (r) => {
              if (r[key] !== defaultVal) {
                console.error(`Setting unsuccessful: ${r[key]} ${defaultVal}`);
              }
            });
          } else {
            console.debug(
              `Key '${key}' already exists with value: ${result[key]}`
            );
          }
        });
      }
    });
  }

  // Check if we're running in Firefox
  if (!isChromeStorage(storage)) {
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

  // Only get links if online features are enabled.
  if (isChromeStorage(storage)) {
    storage.local.get('onlineFeatures', async (onlineFeatures) => {
      if (onlineFeatures.onlineFeatures) {
        const response = await fetchData(Config.endpoint.affiliateLinks);
        if (response) {
          storage.local.set({ affiliate: response.data });
        } else {
          console.error('Error retrieving data:', response);
        }
      }
    });
  } else {
    storage.local
      .get()
      .then(async (onlineFeatures) => {
        if (onlineFeatures.onlineFeatures) {
          const response = await fetchData(Config.endpoint.affiliateLinks);
          if (response) {
            storage.local.set({ affiliate: response.data });
          } else {
            console.error('Error retrieving data:', response);
          }
        }
      })
      .catch((error) => console.error('Error retrieving data:', error));
  }
}
