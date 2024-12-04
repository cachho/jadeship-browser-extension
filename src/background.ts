import { redirectListenerUrls } from './data/redirectListenerUrls';
import { initializeExtension } from './lib/initializeExtension';
import { getStorage, isChromeStorage } from './lib/storage';

/**
 * Adds a listener to listen for redirect events.
 */
function addRedirectListener(isChrome: boolean) {
  if (isChrome) {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.status === 'complete') return;
      if (!changeInfo.url) return;
      const url = new URL(changeInfo.url);
      if (redirectListenerUrls.some((x) => url.host.endsWith(x.hostSuffix))) {
        chrome.scripting.executeScript({
          target: { tabId, allFrames: true },
          files: ['build/js/redirect.js'],
        });
      }
    });
  } else {
    // TODO: Figure out how to get this to work in Firefox
    browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
      browser.tabs
        .executeScript(details.tabId, {
          file: './js/redirect.js',
          allFrames: true,
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error('Error executing script:', error);
        });
    });
  }
}

function main() {
  const storage = getStorage();
  initializeExtension(storage).finally(() => {
    addRedirectListener(isChromeStorage(storage));
  });
}

main();
