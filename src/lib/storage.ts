// Get the storage API for the current browser
export function getStorage():
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

export function isChromeStorage(
  storage: any
): storage is typeof chrome.storage {
  return (
    typeof chrome !== 'undefined' &&
    chrome.storage &&
    storage === chrome.storage
  );
}
