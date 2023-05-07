// Get the storage API for the current browser

import { detectAgent } from './lib/detectAgent';
import { detectPlatform } from './lib/detectPlatform';
import { generateProperLink } from './lib/generateProperLink';
import { getAllAgentLinks } from './lib/getAllAgentLinks';
import { getIdPlatform } from './lib/getIdPlatform';
import { getStorage, isChromeStorage } from './lib/storage';

function getIsAllowedBanner(
  storage: typeof browser.storage | typeof chrome.storage | null
): Promise<any> {
  return new Promise((resolve) => {
    if (storage) {
      if (isChromeStorage(storage)) {
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

const BodyElement = () => {
  const elem = document.createElement('div');
  elem.classList.add('banner');

  // Style Element
  elem.style.background = 'linear-gradient(90deg, #9c28b0 0%, #c659d9 100%)';
  elem.style.width = '100%';
  elem.style.height = '3rem';
  return elem;
};

const QC = () => {
  const qc = document.createElement('div');
  qc.innerText = `📷`;
  return qc;
};

const Close = () => {
  const close = document.createElement('button');
  close.classList.add('close-btn');
  close.textContent = '✖';
  close.style.color = '#fff';
  close.style.background = 'none';
  close.style.border = 'none';
  close.style.cursor = 'pointer';
  return close;
};

const Inner = () => {
  const elem = document.createElement('div');
  elem.style.height = '100%';
  elem.style.paddingLeft = '1rem';
  elem.style.paddingRight = '1rem';
  elem.style.lineHeight = '1rem';
  elem.style.display = 'flex';
  elem.style.flexDirection = 'row';
  elem.style.justifyContent = 'space-between';
  elem.style.alignItems = 'center';
  return elem;
};

async function banner() {
  // Check if user preferences allow banner
  const storage = getStorage();
  const allowed: { onlineFeaturesQcPhotos: boolean; showBanner: boolean } =
    await getIsAllowedBanner(storage);
  if (!allowed.showBanner) {
    return false;
  }

  // Location is a categorization of the current url, either an agent or a platform
  const agent = detectAgent(window.location.href);
  const readPlatform = detectPlatform(window.location.hostname);

  if (!agent && !readPlatform) {
    return false;
  }

  // Get id and platform from wherever we are
  const { id, platform } = getIdPlatform(
    window.location.href,
    agent ?? undefined,
    readPlatform ?? undefined
  );

  if (!id || !platform) {
    return false;
  }

  // Generate links to all platforms.
  const links = getAllAgentLinks(
    generateProperLink(platform, id),
    platform,
    id
  );
  console.log('🚀 ~ file: banner.ts:110 ~ banner ~ links:', links);

  // Build html
  const body = document.querySelector('body');
  if (!body) {
    return false;
  }

  const elem = BodyElement();
  const inner = Inner();
  inner.innerHTML = `${QC().outerHTML + Close().outerHTML}<div>${agent}</div>`;
  elem.innerHTML = inner.outerHTML;

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
