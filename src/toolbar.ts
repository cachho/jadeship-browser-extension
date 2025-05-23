// Get the storage API for the current browser

import type { Agent, AgentWithRaw } from 'cn-links';
import {
  agents,
  agentsWithRaw,
  CnLink,
  detectAgent,
  detectMarketplace,
} from 'cn-links';

import { Button } from './components';
import { Config } from './Config';
import { generateLink, getQcAvailable } from './lib/api/getQcAvailable';
import {
  addObserver,
  handleExceptionElements,
  undoExceptionElements,
} from './lib/handleExceptionElements';
import { getImageAgent } from './lib/html/getImageAgent';
import { getPlatformImage } from './lib/html/getPlatformImage';
import { loadSettings } from './lib/loadSettings';
import { agentsWhereStickyIsNotAStyle, placeToolbar } from './lib/placeToolbar';
import type { CurrentPage, Settings } from './models';

const BodyElement = (settings: Settings, agent?: Agent) => {
  const elem = document.createElement('div');
  elem.classList.add('ra-ext-toolbar');

  // Style Element
  elem.style.background = 'linear-gradient(90deg, #9c28b0 0%, #c659d9 100%)';
  elem.style.width = '100%';
  elem.style.height = '48px';
  elem.style.zIndex = '10000';
  elem.style.flexShrink = '0';

  if (
    settings.stickyToolbar &&
    (!agent || !agentsWhereStickyIsNotAStyle.includes(agent))
  ) {
    elem.style.position = 'sticky';
    elem.style.top = '0px';
  }
  return elem;
};

const QC = (link: CnLink) => {
  const qc = Button(generateLink(link));
  qc.innerText = `📷 QC Pics available`;
  return qc;
};

const Stats = (link: CnLink) => {
  const url = `${Config.host.details}/item/${link.marketplace}/${link.id}`;
  const button = Button(url);
  button.innerText = `📊 Stats`;
  return button;
};

const Links = (currentPage: CurrentPage, settings: Settings) => {
  const div = document.createElement('div');
  div.style.height = '100%';
  div.style.width = '100%';
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.paddingLeft = '16px';
  div.style.paddingRight = '16px';

  const sortKeys = (a: string, b: string) => {
    if (a === settings.myAgent) {
      return 1;
    }
    if (b === settings.myAgent || a === 'raw') {
      return -1;
    }
    return 0;
  };

  if (currentPage.agent) {
    agentsWithRaw
      .filter(
        (agent) =>
          agent !== currentPage.agent &&
          (agent === 'raw' || new Set(settings.agentsInToolbar).has(agent))
      )
      .sort(sortKeys)
      .map((agent: AgentWithRaw) => {
        // Agent button
        const link = currentPage.link.as(agent, undefined, '27');
        const button = Button(link.href, true);
        if (agent === 'raw') {
          button.innerHTML = `${getPlatformImage(
            currentPage.link.marketplace
          )} ${currentPage.link.marketplace}`;
        } else if (agent === settings.myAgent) {
          button.innerHTML = `${getImageAgent(agent)} ${agent}`;
        } else {
          button.innerHTML = getImageAgent(agent);
        }
        button.title = agent;
        div.innerHTML = `${div.innerHTML} ${button.outerHTML}`;
        return button;
      });
  }

  if (currentPage.marketplace) {
    [...agents]
      .filter((agent) => new Set(settings.agentsInToolbar).has(agent))
      .sort(sortKeys)
      .map((agent: Agent) => {
        const link = currentPage.link.as(agent, undefined, '27');
        const button = Button(link.href, true);
        if (agent === settings.myAgent) {
          button.innerHTML = `${getImageAgent(agent)} ${agent}`;
        } else {
          button.innerHTML = getImageAgent(agent);
        }
        button.title = agent;
        div.innerHTML = `${div.innerHTML} ${button.outerHTML}`;
        return button;
      });
  }

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
  elem.style.paddingLeft = '16px';
  elem.style.paddingRight = '16px';
  elem.style.lineHeight = '16px';
  elem.style.display = 'flex';
  elem.style.flexDirection = 'row';
  elem.style.justifyContent = 'space-between';
  elem.style.alignItems = 'center';
  elem.style.maxWidth = '1200px';
  elem.style.marginLeft = 'auto';
  elem.style.marginRight = 'auto';
  return elem;
};

const WebLinks = () => {
  const elem = document.createElement('div');
  elem.style.display = 'flex';
  return elem;
};

async function toolbar() {
  const settings = await loadSettings();

  // Check if user preferences allow toolbar
  if (!settings?.showToolbar) {
    return false;
  }

  const cnLinkResponse = CnLink.safeInstantiate(window.location.href);

  if (!cnLinkResponse.success) return null;

  const currentPage: CurrentPage = {
    link: cnLinkResponse.data,
    agent: detectAgent(window.location.href),
    marketplace: detectMarketplace(new URL(window.location.href)),
  };

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
      const response = await getQcAvailable(currentPage.link);
      if (response?.data && response?.data.qcCount > 0) {
        qcString = QC(currentPage.link).outerHTML;
      }
    } catch (err) {
      console.error(err);
    }
  }

  let statString: string | null = null;
  try {
    statString = Stats(currentPage.link).outerHTML;
  } catch (err) {
    console.error(err);
  }

  // Exceptions
  const agent = detectAgent(window.location.href);
  handleExceptionElements(agent);

  const elem = BodyElement(settings, agent);
  const inner = Inner();
  const webLinks = WebLinks();
  webLinks.innerHTML = `${qcString ?? '<div></div>'} ${
    statString ?? '<div></div>'
  }`;
  inner.innerHTML = `${webLinks.outerHTML} ${
    Links(currentPage, settings).outerHTML
  } ${Close().outerHTML}`;
  elem.innerHTML = inner.outerHTML;
  elem.style.flexShrink = '0';
  // Make sure elem is full width, even as a flex element
  elem.style.width = '100%';
  placeToolbar(settings, body, elem, agent);

  // Close toolbar
  body.addEventListener('click', (event) => {
    if (
      event.target &&
      (event.target as Element).classList.contains('ra-ext-close-btn')
    ) {
      const toolbarElem = document.querySelector(
        '.ra-ext-toolbar'
      ) as HTMLDivElement;
      if (elem) {
        toolbarElem.style.display = 'none';
      }
      undoExceptionElements(currentPage.agent);
    }
  });

  const observer = addObserver(currentPage.marketplace);
  if (observer) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  return true;
}

toolbar();
