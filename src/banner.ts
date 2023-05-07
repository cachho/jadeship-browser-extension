// Get the storage API for the current browser
function getStorageBanner():
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

function isChromeStorageBanner(storage: any): storage is typeof chrome.storage {
  return (
    typeof chrome !== 'undefined' &&
    chrome.storage &&
    storage === chrome.storage
  );
}

function getIsAllowedBanner(
  storage: typeof browser.storage | typeof chrome.storage | null
): Promise<any> {
  return new Promise((resolve) => {
    if (storage) {
      if (isChromeStorageBanner(storage)) {
        storage.local.get(
          ['showBanner', 'onlineFeaturesQcPhotos'],
          (showBanner) => {
            resolve(showBanner);
          }
        );
      } else {
        storage.local
          .get(['showBanner', 'onlineFeaturesQcPhotos'])
          .then((showBanner) => {
            resolve(showBanner);
          });
      }
    } else {
      console.error('No storage available');
      resolve(null);
    }
  });
}

function setInnerHtml(): string {
  // QC Element
  const qc = document.createElement('div');
  qc.innerText = `📷`;

  // Close Element
  const close = document.createElement('button');
  close.classList.add('close-btn');
  close.textContent = '✖';
  close.style.color = '#fff';
  close.style.background = 'none';
  close.style.border = 'none';

  // Merge into div
  const div = document.createElement('div');
  div.style.height = '100%';
  div.style.width = '100%';
  div.style.display = 'flex';
  div.style.flexDirection = 'row';
  div.style.alignItems = 'center';
  div.style.color = '#fff';
  div.appendChild(qc);
  div.appendChild(close);

  return div.outerHTML;
}

async function banner() {
  // Check if user preferences allow banner
  const storage = getStorageBanner();
  const allowed: { onlineFeaturesQcPhotos: boolean; showBanner: boolean } =
    await getIsAllowedBanner(storage);
  if (!allowed.showBanner) {
    return false;
  }

  const body = document.querySelector('body');
  if (!body) {
    return false;
  }

  const elem = document.createElement('div');
  elem.classList.add('banner');

  // Style Element
  elem.style.background = 'linear-gradient(90deg, #9c28b0 0%, #c659d9 100%)';
  elem.style.width = '100vw';
  elem.style.height = '3rem';
  elem.style.paddingLeft = '1rem';
  elem.style.paddingRight = '1rem';
  elem.style.lineHeight = '1rem';

  // Add glowing outline
  elem.style.boxShadow = '0 0 10px 1px rgba(255, 255, 255, 0.2)';

  elem.innerHTML = setInnerHtml();

  body.insertAdjacentElement('afterbegin', elem);

  body.addEventListener('click', (event) => {
    if (
      event.target &&
      (event.target as Element).classList.contains('close-btn')
    ) {
      const bannerElem = document.querySelector('.banner') as HTMLDivElement;
      if (elem) {
        bannerElem.style.display = 'none';
      }
    }
  });

  return true;
}

banner();
