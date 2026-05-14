// Get the storage API for the current browser

import type { Agent, AgentWithRaw } from 'cn-links';
import {
  agents,
  agentsWithRaw,
  CnLink,
  detectAgent,
  detectMarketplace,
} from 'cn-links';

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
import { placeToolbar } from './lib/placeToolbar';
import type { CurrentPage, Settings } from './models';

const BodyElement = () => {
  const elem = document.createElement('div');
  elem.classList.add('ra-ext-toolbar');

  // Floating rounded bar styling
  elem.style.background = 'rgba(10, 10, 10, 0.95)';
  elem.style.backdropFilter = 'blur(20px)';
  elem.style.border = '1px solid rgba(255, 255, 255, 0.08)';
  elem.style.borderRadius = '24px';
  elem.style.width = '30vw';
  elem.style.maxWidth = '90vw';
  elem.style.height = '56px';
  elem.style.zIndex = '10000';
  elem.style.flexShrink = '0';
  elem.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  elem.style.boxShadow =
    '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)';

  // Floating positioning
  elem.style.position = 'fixed';
  elem.style.top = '20px';
  elem.style.left = '50%';
  elem.style.transform = 'translateX(-50%)';
  elem.style.margin = '0 auto';

  return elem;
};

const StyledButton = (url: string, isAgentButton = false) => {
  const button = document.createElement('a');
  button.href = url;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';

  // Base styling matching popup buttons
  button.style.display = 'inline-flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.padding = isAgentButton ? '8px 10px' : '8px 14px';
  button.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
  button.style.border = '1px solid rgba(255, 255, 255, 0.08)';
  button.style.borderRadius = '12px';
  button.style.color = 'white';
  button.style.textDecoration = 'none';
  button.style.fontSize = isAgentButton ? '12px' : '14px';
  button.style.fontWeight = '500';
  button.style.transition = 'all 0.2s ease';
  button.style.cursor = 'pointer';
  button.style.whiteSpace = 'nowrap';
  button.style.minHeight = '32px';
  button.style.minWidth = isAgentButton ? '32px' : 'auto';

  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
    button.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    button.style.transform = 'translateY(-1px)';
    button.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
    button.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = 'none';
  });

  return button;
};

const QC = (link: CnLink) => {
  const qc = StyledButton(generateLink(link));
  qc.innerHTML = '<span style="margin-right: 6px;">📷</span> QC Pics';
  qc.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
  qc.style.borderColor = 'rgba(16, 185, 129, 0.3)';
  qc.addEventListener('mouseenter', () => {
    qc.style.background = 'linear-gradient(135deg, #059669, #0891b2)';
    qc.style.transform = 'translateY(-1px)';
    qc.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
  });
  qc.addEventListener('mouseleave', () => {
    qc.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
    qc.style.transform = 'translateY(0)';
    qc.style.boxShadow = 'none';
  });
  return qc;
};

const Stats = (link: CnLink) => {
  const url = `${Config.host.details}/item/${link.marketplace}/${link.id}`;
  const button = StyledButton(url);
  button.innerHTML = '<span style="margin-right: 6px;">📊</span> Stats';
  return button;
};

const Links = (currentPage: CurrentPage, settings: Settings) => {
  const div = document.createElement('div');
  div.style.height = '100%';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.gap = '6px';
  div.style.flexWrap = 'wrap';
  div.style.justifyContent = 'center';
  div.style.flex = '1';
  div.style.minWidth = '0';

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
      .forEach((agent: AgentWithRaw) => {
        const link = currentPage.link.as(agent, undefined, '27');
        const button = StyledButton(link.href, true);

        if (agent === 'raw') {
          button.innerHTML = `${getPlatformImage(
            currentPage.link.marketplace
          )}`;
          button.title = currentPage.link.marketplace;
        } else if (agent === settings.myAgent) {
          button.innerHTML = `${getImageAgent(agent)}`;
          button.style.background = 'rgba(16, 185, 129, 0.1)';
          button.style.borderColor = 'rgba(16, 185, 129, 0.2)';
          button.title = `${agent} (My Agent)`;
        } else {
          button.innerHTML = getImageAgent(agent);
          button.title = agent;
        }
        div.appendChild(button);
      });
  }

  if (currentPage.marketplace) {
    [...agents]
      .filter((agent) => new Set(settings.agentsInToolbar).has(agent))
      .sort(sortKeys)
      .forEach((agent: Agent) => {
        const link = currentPage.link.as(agent, undefined, '27');
        const button = StyledButton(link.href, true);

        if (agent === settings.myAgent) {
          button.innerHTML = `${getImageAgent(agent)}`;
          button.style.background = 'rgba(16, 185, 129, 0.1)';
          button.style.borderColor = 'rgba(16, 185, 129, 0.2)';
          button.title = `${agent} (My Agent)`;
        } else {
          button.innerHTML = getImageAgent(agent);
          button.title = agent;
        }
        div.appendChild(button);
      });
  }

  return div;
};

const Close = () => {
  const close = document.createElement('button');
  close.classList.add('ra-ext-close-btn');
  close.innerHTML = '✕';
  close.style.color = 'rgba(255, 255, 255, 0.7)';
  close.style.background = 'rgba(255, 255, 255, 0.03)';
  close.style.border = '1px solid rgba(255, 255, 255, 0.08)';
  close.style.borderRadius = '10px';
  close.style.cursor = 'pointer';
  close.style.width = '28px';
  close.style.height = '28px';
  close.style.display = 'flex';
  close.style.alignItems = 'center';
  close.style.justifyContent = 'center';
  close.style.fontSize = '12px';
  close.style.fontWeight = '500';
  close.style.transition = 'all 0.2s ease';
  close.style.flexShrink = '0';

  close.addEventListener('mouseenter', () => {
    close.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    close.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    close.style.color = '#f87171';
  });

  close.addEventListener('mouseleave', () => {
    close.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
    close.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    close.style.color = 'rgba(255, 255, 255, 0.7)';
  });

  return close;
};

const Inner = () => {
  const elem = document.createElement('div');
  elem.style.height = '100%';
  elem.style.paddingLeft = '20px';
  elem.style.paddingRight = '20px';
  elem.style.display = 'flex';
  elem.style.flexDirection = 'row';
  elem.style.justifyContent = 'space-between';
  elem.style.alignItems = 'center';
  elem.style.gap = '12px';
  elem.style.whiteSpace = 'nowrap';
  return elem;
};

const WebLinks = () => {
  const elem = document.createElement('div');
  elem.style.display = 'flex';
  elem.style.alignItems = 'center';
  elem.style.gap = '8px';
  elem.style.flexShrink = '0';
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

  let qcButton: HTMLElement | null = null;
  if (settings.onlineFeaturesQcPhotos) {
    try {
      const response = await getQcAvailable(currentPage.link);
      if (response?.data && response?.data.qcCount > 0) {
        qcButton = QC(currentPage.link);
      }
    } catch (err) {
      console.error(err);
    }
  }

  let statsButton: HTMLElement | null = null;
  try {
    statsButton = Stats(currentPage.link);
  } catch (err) {
    console.error(err);
  }

  // Exceptions
  const agent = detectAgent(window.location.href);
  handleExceptionElements(agent);

  const elem = BodyElement();
  const inner = Inner();
  const webLinks = WebLinks();

  if (qcButton) webLinks.appendChild(qcButton);
  if (statsButton) webLinks.appendChild(statsButton);

  const linksContainer = Links(currentPage, settings);
  const closeButton = Close();

  inner.appendChild(webLinks);
  inner.appendChild(linksContainer);
  inner.appendChild(closeButton);
  elem.appendChild(inner);

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
      if (toolbarElem) {
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
