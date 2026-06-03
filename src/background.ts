import { Config } from "./Config";
import { redirectListenerUrls } from "./data/redirectListenerUrls";
import { initializeExtension } from "./lib/initializeExtension";
import {
  createRateReminderState,
  RATE_REMINDER_STORAGE_KEY,
} from "./lib/rateReminder";
import { getStorage, isChromeStorage } from "./lib/storage";

/**
 * Adds a listener to listen for redirect events.
 */
function addRedirectListener(isChrome: boolean) {
  if (isChrome) {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.status === "complete") return;
      if (!changeInfo.url) return;
      const url = new URL(changeInfo.url);
      if (redirectListenerUrls.some((x) => url.host.endsWith(x.hostSuffix))) {
        chrome.scripting.executeScript({
          target: { tabId, allFrames: true },
          files: ["js/redirect.js"],
        });
      }
    });
  } else {
    // TODO: Figure out how to get this to work in Firefox
    browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
      browser.tabs
        .executeScript(details.tabId, {
          file: "./js/redirect.js",
          allFrames: true,
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error("Error executing script:", error);
        });
    });
  }
}

function addInstallListener(isChrome: boolean) {
  if (isChrome) {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install") return;
      chrome.storage.local.set({
        [RATE_REMINDER_STORAGE_KEY]: createRateReminderState(),
      });
      chrome.tabs.create({ url: Config.social.newInstallation });
    });
  } else {
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install") return;
      browser.storage.local.set({
        [RATE_REMINDER_STORAGE_KEY]: createRateReminderState(),
      });
      browser.tabs.create({ url: Config.social.newInstallation });
    });
  }
}

function main() {
  const storage = getStorage();
  addInstallListener(isChromeStorage(storage));
  initializeExtension(storage).finally(() => {
    addRedirectListener(isChromeStorage(storage));
  });
}

main();
