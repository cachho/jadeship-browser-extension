type Settings2 = {
  agentLink: boolean;
  affiliateProgram: boolean;
  affiliateAppend: boolean;
  logoAgent: boolean;
  logoPlatform: boolean;
  myAgent: 'superbuy' | 'wegobuy' | 'pandabuy' | 'sugargoo' | 'cssbuy';
  telemetryData: boolean;
  taobaoLink: boolean;
  weidianLink: boolean;
  s1688Link: boolean;
  tmallLink: boolean;
  onlineFeatures: boolean;
  onlineFeaturesQcPhotos: boolean;
  showThumbnail: boolean;
  showPrice: boolean;
  showAmountSoldSummary: boolean;
  showAmountSold1: boolean;
  showAmountSold7: boolean;
  showAmountSold30: boolean;
  showAmountSoldAt: boolean;
  showAmountSoldTimeframeLabel: boolean;
  showPos: boolean;
  showTitle: boolean;
  displayTitleLength: string;
  displayOverwriteTitle: boolean;
};

const defaultSettings: Settings2 = {
  agentLink: true,
  affiliateProgram: true,
  affiliateAppend: false,
  logoAgent: false,
  logoPlatform: true,
  myAgent: 'wegobuy',
  telemetryData: true,
  taobaoLink: true,
  weidianLink: true,
  s1688Link: true,
  tmallLink: true,
  onlineFeatures: true,
  onlineFeaturesQcPhotos: true,
  showThumbnail: true,
  showPrice: true,
  showAmountSoldSummary: false,
  showAmountSold1: false,
  showAmountSold7: false,
  showAmountSold30: true,
  showAmountSoldAt: false,
  showAmountSoldTimeframeLabel: false,
  showPos: false,
  showTitle: true,
  displayTitleLength: '64',
  displayOverwriteTitle: false,
};

function initializeExtension() {
  /**
   * This script initializes local storage with default values and from the api.
   * @returns void
   */
  //

  function getStorage(): typeof browser.storage | typeof chrome.storage | null {
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

  function isChromeStorage(storage: any): storage is typeof chrome.storage {
    return (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      storage === chrome.storage
    );
  }

  const storage = getStorage();
  // Check if we're running in Chrome
  if (storage && isChromeStorage(storage)) {
    Object.keys(defaultSettings).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
        const params: { [key: string]: any } = {};
        params[key] = null;
        storage.local.get(params, (result) => {
          if (
            !Object.prototype.hasOwnProperty.call(result, key) ||
            !result[key]
          ) {
            const defaultVal = defaultSettings[key as keyof Settings2];
            storage.local.set({ [key]: defaultVal });
          }
        });
      }
    });
  }

  // Check if we're running in Firefox
  if (storage && !isChromeStorage(storage)) {
    Object.keys(defaultSettings).forEach((key) => {
      const params: { [key: string]: any } = {};
      params[key] = null;
      storage.local.get(params).then((result) => {
        if (
          !Object.prototype.hasOwnProperty.call(result, key) ||
          !result[key]
        ) {
          const defaultVal = defaultSettings[key as keyof Settings2];
          storage.local.set({ [key]: defaultVal });
        }
      });
    });
  }

  async function fetchData(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  if (storage) {
    // Only get links if online features are enabled.
    if (isChromeStorage(storage)) {
      storage.local.get('onlineFeatures', (onlineFeatures) => {
        if (onlineFeatures) {
          fetchData('https://api.ch-webdev.com/affiliate-links')
            .then((response) => storage.local.set({ affiliate: response.data }))
            .catch((error) => console.error('Error fetching data:', error));
        }
      });
    } else {
      storage.local
        .get()
        .then((onlineFeatures) => {
          if (onlineFeatures) {
            fetchData('https://api.ch-webdev.com/affiliate-links')
              .then((response) =>
                storage.local.set({ affiliate: response.data })
              )
              .catch((error) => console.error('Error fetching data:', error));
          }
        })
        .catch((error) => console.error('Error retrieving data:', error));
    }
  }
}

initializeExtension();
