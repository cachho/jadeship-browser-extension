// Get the storage API for the current browser

import { Button } from './components';
import { getQcAvailable } from './lib/api/getQcAvailable';
import { detectAgent } from './lib/detectAgent';
import { detectPlatform } from './lib/detectPlatform';
import { generateProperLink } from './lib/generateProperLink';
import { getAllAgentLinks } from './lib/getAllAgentLinks';
import { getIdPlatform } from './lib/getIdPlatform';
import { loadSettings } from './lib/loadSettings';
import type { Agent, Platform, QcAvailable } from './models';

const BodyElement = () => {
  const elem = document.createElement('div');
  elem.classList.add('banner');

  // Style Element
  elem.style.background = 'linear-gradient(90deg, #9c28b0 0%, #c659d9 100%)';
  elem.style.width = '100%';
  elem.style.height = '3rem';
  return elem;
};

const QC = (response: QcAvailable) => {
  const qc = Button(response.link);
  qc.innerText = `📷 QC Pics available`;
  return qc;
};

const Links = (
  links: {
    superbuy: string;
    wegobuy: string;
    pandabuy: string;
    sugargoo: string;
    cssbuy: string;
    raw: string;
  },
  active: Platform | Agent
) => {
  const div = document.createElement('div');
  Object.keys(links)
    .filter((key) => key !== active && links[key as Agent])
    .map((key) => {
      const link = links[key as Agent];
      const button = Button(link, true);
      button.innerText =
        key !== 'raw' ? key : detectPlatform(new URL(link).hostname) ?? key;
      div.innerHTML = `${div.innerHTML} ${button.outerHTML}`;
      return button;
    });

  return div;
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
  const settings = await loadSettings();

  // Check if user preferences allow banner
  if (!settings?.showBanner) {
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

  let qcString: string | null = null;
  if (!settings.onlineFeaturesQcPhotos) {
    qcString = null;
  } else {
    try {
      const response = await getQcAvailable(platform, id);
      console.log('🚀 ~ file: banner.ts:100 ~ banner ~ response:', response);
      if (response && response.state === 0 && response.data) {
        qcString = QC(response).outerHTML;
      }
    } catch (err) {
      console.error(err);
    }
  }

  console.log('🚀 ~ file: banner.ts:132 ~ banner ~ qcString:', qcString);

  const elem = BodyElement();
  const inner = Inner();
  inner.innerHTML = `${qcString ?? ''} ${
    Links(links, agent || readPlatform!).outerHTML
  } ${Close().outerHTML}`;
  elem.innerHTML = inner.outerHTML;
  body.insertAdjacentElement('afterbegin', elem);

  // Close banner
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
