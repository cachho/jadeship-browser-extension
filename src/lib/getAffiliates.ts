import type { Affiliate } from '../models';
import { isRedirectAllowed } from './isRedirectAllowed';
import { getStorage, isChromeStorage } from './storage';

export async function getAffiliates(): Promise<Affiliate[] | null> {
  const storage = getStorage();

  // Check if affiliates feature is enabled
  const isAllowed = await isRedirectAllowed(storage);
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
