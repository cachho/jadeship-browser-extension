import type { Settings } from '../models/Settings';
import { settingNames } from '../models/Settings';
import { getStorage, isChromeStorage } from './storage';

export function loadSettings(settings?: string[]): Promise<Settings | null> {
  const storage = getStorage();
  if (!storage) {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  if (isChromeStorage(storage)) {
    return new Promise((resolve) => {
      storage.local.get(settings ?? settingNames, (data) => {
        resolve(data as Settings);
      });
    });
  }
  return storage.local.get(settings ?? settingNames) as Promise<Settings>;
}
