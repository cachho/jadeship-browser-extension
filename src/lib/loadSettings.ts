import { getStorage, isChromeStorage } from './storage';

export function loadSettings(settings: string[]) {
  const storage = getStorage();
  if (!storage) {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  if (isChromeStorage(storage)) {
    return new Promise((resolve) => {
      storage.local.get(settings, (data) => {
        resolve(data);
      });
    });
  }
  return storage.local.get(settings);
}
