import { isChromeStorage } from './storage';

export function isRedirectAllowed(
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
