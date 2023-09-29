import type { Settings } from '../models/Settings';
import { defaultSettings, settingNames } from '../models/Settings';

describe('Settings type keys', () => {
  it('should have all keys present in the settingNames array', () => {
    // Extract keys
    const settingsKeys = Object.keys(defaultSettings);

    // Find missing keys
    const missingKeys = settingsKeys.filter(
      (key) => !settingNames.includes(key as keyof Settings)
    );

    // Check if there are no missing keys
    expect(missingKeys).toEqual([]);
  });
});
