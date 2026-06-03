import { Config } from "./Config";
import { redirectListenerUrls } from "./data/redirectListenerUrls";
import {
  INSTALL_TIME_STORAGE_KEY,
  initializeExtension,
} from "./lib/initializeExtension";
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
      chrome.tabs.create({ url: Config.social.newInstallation });
    });
  } else {
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install") return;
      browser.tabs.create({ url: Config.social.newInstallation });
    });
  }
}

function addUninstallListener(isChrome: boolean) {
  const baseUrl = new URL(Config.social.uninstall);
  const version = isChrome
    ? chrome.runtime.getManifest().version
    : browser.runtime.getManifest().version;
  baseUrl.searchParams.set("v", version);
  baseUrl.searchParams.set("ua", navigator.userAgent);

  if (isChrome) {
    chrome.storage.local.get(
      { [INSTALL_TIME_STORAGE_KEY]: null },
      (result: Record<string, unknown>) => {
        if (result[INSTALL_TIME_STORAGE_KEY]) {
          baseUrl.searchParams.set(
            "installTime",
            String(result[INSTALL_TIME_STORAGE_KEY]),
          );
        }
        chrome.runtime.setUninstallURL(baseUrl.toString());
      },
    );
  } else {
    browser.storage.local
      .get({ [INSTALL_TIME_STORAGE_KEY]: null })
      .then((result: Record<string, unknown>) => {
        if (result[INSTALL_TIME_STORAGE_KEY]) {
          baseUrl.searchParams.set(
            "installTime",
            String(result[INSTALL_TIME_STORAGE_KEY]),
          );
        }
        browser.runtime.setUninstallURL(baseUrl.toString());
      })
      .catch((error: unknown) =>
        console.error("Error setting uninstall URL:", error),
      );
  }
}

function main() {
  const storage = getStorage();
  addInstallListener(isChromeStorage(storage));
  initializeExtension(storage).finally(() => {
    addUninstallListener(isChromeStorage(storage));
    addRedirectListener(isChromeStorage(storage));
  });
}

main();
