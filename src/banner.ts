// Get the storage API for the current browser

import { Button } from './components';
import { getQcAvailable } from './lib/api/getQcAvailable';
import { detectAgent } from './lib/detectAgent';
import { detectPlatform } from './lib/detectPlatform';
import { generateProperLink } from './lib/generateProperLink';
import { getAllAgentLinks } from './lib/getAllAgentLinks';
import { getIdPlatform } from './lib/getIdPlatform';
import { getImageAgent } from './lib/html/getImageAgent';
import { getPlatformImage } from './lib/html/getPlatformImage';
import { loadSettings } from './lib/loadSettings';
import type { Agent, AgentWithRaw, Platform, QcAvailable } from './models';

const BodyElement = () => {
  const elem = document.createElement('div');
  elem.classList.add('ra-ext-banner');

  // Style Element
  elem.style.background = 'linear-gradient(90deg, #9c28b0 0%, #c659d9 100%)';
  elem.style.width = '100%';
  elem.style.height = '3rem';
  elem.style.zIndex = '10000';
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
  active: Platform | Agent,
  myAgent: AgentWithRaw
) => {
  const div = document.createElement('div');

  const sortKeys = (a: string, b: string) => {
    if (a === myAgent) {
      return -1;
    }
    if (b === myAgent) {
      return 1;
    }
    return 0;
  };

  Object.keys(links)
    .filter((key) => key !== active && links[key as Agent])
    .sort(sortKeys)
    .map((key) => {
      const link = links[key as Agent];
      const button = Button(link, true);
      if (key === 'raw') {
        const platform = detectPlatform(new URL(link).hostname);
        if (platform) {
          button.innerHTML = `${getPlatformImage(platform)} ${platform}`;
        } else {
          button.innerText = platform ?? key;
        }
      } else if (key === myAgent) {
        button.innerHTML = `${getImageAgent(key as Agent)} ${key}`;
      } else {
        button.innerHTML = getImageAgent(key as Agent);
      }

      div.innerHTML = `${div.innerHTML} ${button.outerHTML}`;
      return button;
    });

  return div;
};

const Close = () => {
  const close = document.createElement('button');
  close.classList.add('ra-ext-close-btn');
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

  // Either one should be detected, depending on whether you are on an agent or platform page.
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
  console.log('🚀 ~ file: banner.ts:124 ~ banner ~ platform:', platform);
  console.log('🚀 ~ file: banner.ts:124 ~ banner ~ id:', id);

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
    Links(links, agent || readPlatform!, settings.myAgent).outerHTML
  } ${Close().outerHTML}`;
  elem.innerHTML = inner.outerHTML;
  body.insertAdjacentElement('afterbegin', elem);

  // Close banner
  body.addEventListener('click', (event) => {
    if (
      event.target &&
      (event.target as Element).classList.contains('ra-ext-close-btn')
    ) {
      const bannerElem = document.querySelector(
        '.ra-ext-banner'
      ) as HTMLDivElement;
      if (elem) {
        bannerElem.style.display = 'none';
      }
    }
  });

  return true;
}

banner();
