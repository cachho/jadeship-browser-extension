/* eslint-disable no-param-reassign */
type Agent = 'superbuy' | 'wegobuy' | 'pandabuy' | 'sugargoo' | 'cssbuy';

type Platform = 'weidian' | 'taobao' | '1688' | 'tmall';

type Settings = {
  agentLink: boolean;
  affiliateProgram: boolean;
  affiliateAppend: boolean;
  logoAgent: boolean;
  logoPlatform: boolean;
  myAgent: Agent;
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
  affiliate: Affiliate[];
};

type Affiliate = {
  active: boolean;
  altRef?: string;
  dateAdded: string;
  incentive?: string;
  itemUrlTaobao?: string;
  itemUrlWeidian?: string;
  name: Agent | string;
  owner: string;
  param?: string;
  ref?: string;
  tag?: string;
  url: string;
};

type ApiResponse<T> = {
  msg: string;
  serverTime: number;
  state: 0 | 1;
  data?: T;
};

type Details = {
  amountSold: {
    1: number;
    7: number;
    30: number;
    at: number;
    pos: number;
  };
  item: {
    goodsPicUrl: string;
    goodsPrice: number;
    goodsTitle: string;
  };
};

type QcAvailable = { data: boolean; state: 0 | 1; link: string };

// Get the storage API for the current browser
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

function loadSettings() {
  const names = [
    'taobaoLink',
    'weidianLink',
    's1688Link',
    'tmallLink',
    'agentLink',
    'logoAgent',
    'logoPlatform',
    'myAgent',
    'affiliateProgram',
    'affiliateAppend',
    'onlineFeatures',
    'onlineFeaturesQcPhotos',
    'masterToggle',
    'showThumbnail',
    'showPrice',
    'showAmountSoldSummary',
    'showAmountSold1',
    'showAmountSold7',
    'showAmountSold30',
    'showAmountSoldAt',
    'showAmountSoldTimeframeLabel',
    'showPos',
    'showTitle',
    'displayTitleLength',
    'displayOverwriteTitle',
    'affiliate',
  ];

  const storage = getStorage();
  if (!storage) {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  if (isChromeStorage(storage)) {
    return new Promise((resolve) => {
      storage.local.get(names, (data) => {
        resolve(data);
      });
    });
  }
  return storage.local.get(names);
}

function getLinks(settings: Settings) {
  let targetedHrefs: string[] = [];

  if (settings.weidianLink) {
    targetedHrefs = targetedHrefs.concat([
      'weidian.com/item',
      'weidian.com/fastorder',
    ]);
  }

  if (settings.taobaoLink) {
    targetedHrefs = targetedHrefs.concat([
      'taobao.com/item',
      'm.intl.taobao.com/detail',
    ]);
  }

  if (settings.s1688Link) {
    targetedHrefs = targetedHrefs.concat([
      // "qr.1688.com/s",
      'm.1688.com/offer',
      'detail.1688.com/offer',
      'qr.1688.com/s/',
    ]);
  }

  if (settings.tmallLink) {
    targetedHrefs = targetedHrefs.concat([
      'detail.tmall.com/item',
      'item.tmall.com/item',
    ]);
  }

  if (settings.agentLink) {
    targetedHrefs = targetedHrefs.concat([
      'wegobuy.com/en/page/buy',
      'superbuy.com/en/page/buy',
      'm.superbuy.com',
      'pandabuy.com/product',
      'pandabuy.page.link',
      'sugargoo.com/index/item',
      'cssbuy.com/item',
    ]);
  }

  const links = Array.from(
    document.querySelectorAll('a:not([contenteditable="true"])')
  ) as HTMLAnchorElement[];

  return links
    .filter((a) => targetedHrefs.some((href) => a.href.indexOf(href) !== -1))
    .filter((a) => a.dataset.reparchiveExtension !== 'true');
}

function getDomainFromHostname(hostname: string): string {
  const parts = hostname.split('.');
  const domain = parts.slice(-2).join('.');
  return domain;
}

function isAgentLink(hostname: string): boolean {
  const domain = getDomainFromHostname(hostname);
  const agents: Agent[] = [
    'cssbuy',
    'pandabuy',
    'sugargoo',
    'superbuy',
    'wegobuy',
  ];
  return agents.some((agent) => domain.indexOf(agent) !== -1);
}

function extractInnerLink(link: HTMLAnchorElement | URL): URL | null {
  const urlParams = new URLSearchParams(link.search ?? link);
  const innerParam = urlParams.get('url');
  if (!innerParam) {
    return null;
  }
  const innerLink = new URL(innerParam);
  if (innerLink) {
    return innerLink;
  }
  return null;
}

async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    // console.error(error);
    return null;
  }
}

function generateProperLink(platform: Platform, id: string): string {
  if (platform === 'weidian') {
    const urlParams = new URLSearchParams();
    urlParams.set('itemID', id);
    return `https://weidian.com/item.html?${urlParams.toString()}`;
  }
  if (platform === 'taobao') {
    const urlParams = new URLSearchParams();
    urlParams.set('id', id);
    return `https://item.taobao.com/item.html?${urlParams.toString()}`;
  }
  if (platform === '1688') {
    // https://detail.1688.com/offer/669220179358.html
    return `https://detail.1688.com/offer/${id}.html`;
  }
  if (platform === 'tmall') {
    const urlParams = new URLSearchParams();
    urlParams.set('id', id);
    return `https://detail.tmall.com/item_o.htm?${urlParams.toString()}`;
  }
  return '';
}

function decryptCssbuy(link: HTMLAnchorElement): URL | null {
  if (link.pathname.startsWith('/item-micro')) {
    const id = link.pathname.split('-')[2].split('.')[0];
    if (id) {
      return new URL(generateProperLink('weidian', id));
    }
  }
  if (link.pathname.startsWith('/item-1688')) {
    const id = link.pathname.split('-')[2].split('.')[0];
    if (id) {
      return new URL(generateProperLink('1688', id));
    }
  }
  if (link.pathname.startsWith('/item')) {
    const id = link.pathname.split('-')[1].split('.')[0];
    if (id) {
      return new URL(generateProperLink('taobao', id));
    }
  }
  return null;
}

async function handleShortenedLink(
  link: HTMLAnchorElement,
  settings: Settings
): Promise<URL | null> {
  if (link.hostname === 'pandabuy.page.link' && settings.onlineFeatures) {
    const url = `https://api.ch-webdev.com/convert-pandabuy${link.pathname}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  } else if (link.hostname === 'qr.1688.com' && settings.onlineFeatures) {
    const url = `https://api.ch-webdev.com/convert-1688/${link.pathname.slice(
      3
    )}`;
    const response: ApiResponse<{ url: string }> = await fetchData(url);
    if (response && response.data) {
      return new URL(response.data.url);
    }
  } else if (
    link.hostname === 'cssbuy.com' ||
    link.hostname === 'www.cssbuy.com'
  ) {
    const decryptedCssbuy = decryptCssbuy(link);
    if (decryptedCssbuy) {
      link.href = decryptedCssbuy.href;
      return decryptedCssbuy;
    }
  }
  return null;
}

async function getLink(
  elem: HTMLAnchorElement,
  settings: Settings
): Promise<URL | null> {
  const extractedLink = await handleShortenedLink(elem, settings);
  const inputUrl = extractedLink ?? elem;
  const isAgent = isAgentLink(inputUrl.hostname);
  const link = isAgent ? extractInnerLink(inputUrl) : new URL(elem.href);
  if (!link) {
    return null;
  }
  return link;
}

function detectPlatform(hostname: string): Platform | null {
  const domain = getDomainFromHostname(hostname);

  if (domain === 'weidian.com') {
    return 'weidian';
  }
  if (domain === 'taobao.com') {
    return 'taobao';
  }
  if (domain === '1688.com') {
    return '1688';
  }
  if (domain === 'tmall.com') {
    return 'tmall';
  }

  return null;
}

function extractId(platform: Platform, link: string) {
  const url = new URL(link);
  const urlParams = new URLSearchParams(url.search ?? link);
  // For regular Taobao and Weidian Links
  if (platform === 'weidian') {
    if (urlParams.get('itemID')) {
      return urlParams.get('itemID');
    }
  } else if (platform === 'taobao') {
    if (link.indexOf('world.taobao.com') !== -1) {
      const id = link.split('item/')[1].split('.')[0];
      if (!Number.isNaN(Number(id))) {
        return id;
      }
    }
    if (urlParams.get('id')) {
      return urlParams.get('id');
    }
  } else if (platform === '1688') {
    // If it's still shortened at this point it can't be saved.
    if (link.indexOf('qr.1688.com') !== -1) {
      return null;
    }
    // 1688 doesn't use urlParams
    if (link.indexOf('offer')) {
      const id =
        link.indexOf('offer/') !== -1
          ? link.split('offer/')[1].split('.')[0]
          : link.split('offer%2F')[1].split('.')[0];
      // Validate number
      if (!Number.isNaN(Number(id))) {
        return id;
      }
    }
  } else if (platform === 'tmall') {
    if (urlParams.get('id')) {
      return urlParams.get('id');
    }
  }
  return null;
}

function getAffiliate(settings: Settings, agent: Agent) {
  if (!settings.affiliateProgram || !settings.affiliateAppend) {
    // Returns null if the user set the setting to disable affiliates
    return null;
  }
  return settings.affiliate.find((a) => {
    return a.name === agent;
  });
}

function buildLink(
  agent: Agent,
  innerLink: string,
  platform: Platform,
  id: string,
  settings: Settings
) {
  const urlParams = new URLSearchParams();
  // Get affiliates object from local storage
  const aff = getAffiliate(settings, agent);

  if (agent === 'pandabuy') {
    // https://www.pandabuy.com/product?ra=500&url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D2724693540&inviteCode=ZQWFRJZEB
    urlParams.set('ra', '500');
    urlParams.set('url', innerLink);
    if (aff && aff.param && aff.ref) {
      urlParams.set(aff.param, aff.ref);
    }
    return `https://www.pandabuy.com/product?${urlParams.toString()}`;
  }
  if (agent === 'wegobuy') {
    // https://www.wegobuy.com/en/page/buy?from=search-input&url=https%3A%2F%2Fitem.taobao.com%2Fitem.html%3Fid%3D675330231400&partnercode=6t86Xk
    urlParams.set('from', 'search-input');
    urlParams.set('url', innerLink);
    if (aff && aff.param && aff.ref) {
      urlParams.set(aff.param, aff.ref);
    }
    return `https://www.wegobuy.com/en/page/buy?${urlParams.toString()}`;
  }
  if (agent === 'superbuy') {
    // https://www.wegobuy.com/en/page/buy?from=search-input&url=https%3A%2F%2Fitem.taobao.com%2Fitem.html%3Fid%3D675330231400&partnercode=6t86Xk
    urlParams.set('from', 'search-input');
    urlParams.set('url', innerLink);
    if (aff && aff.param && aff.ref) {
      urlParams.set(aff.param, aff.ref);
    }
    return `https://www.superbuy.com/en/page/buy?${urlParams.toString()}`;
  }
  if (agent === 'sugargoo') {
    // https://www.sugargoo.com/index/item/index.html?tp=taobao&searchLang=en&url=https%3A%2F%2Fitem.taobao.com%2Fitem.html%3Fid%3D675330231400&partnercode=UmVwQXJjaGl2ZQ==
    urlParams.set('tp', 'taobao');
    urlParams.set('searchlang', 'en');
    urlParams.set('url', innerLink);
    // return `https://www.sugargoo.com/index/item/index.html?${urlParams.toString()}`;
    if (aff && aff.param && aff.ref) {
      urlParams.set(aff.param, aff.altRef ?? aff.ref);
    }
    return `https://www.sugargoo.com/index/item/index.html?${urlParams.toString()}${
      settings.affiliateProgram &&
      settings.affiliateAppend &&
      aff &&
      aff.param &&
      aff.ref
        ? '=='
        : ''
    }`;
  }
  if (agent === 'cssbuy') {
    // https://www.cssbuy.com/item-675330231400&promotionCode=Y2h3ZWJkZXZlbG9wbWVudA
    // https://www.cssbuy.com/item-micro-4480454092&promotionCode=Y2h3ZWJkZXZlbG9wbWVudA
    if (aff && aff.param && aff.ref) {
      urlParams.set(aff.param, aff.altRef ?? aff.ref);
    }
    if (platform === 'weidian') {
      return `https://www.cssbuy.com/item-micro-${id}?${urlParams.toString()}`;
    }
    if (platform === '1688') {
      return `https://www.cssbuy.com/item-1688-${id}?${urlParams.toString()}`;
    }
    return `https://www.cssbuy.com/item-${id}?${urlParams.toString()}`;
  }
  return 'temp';
}

function buildPlatformNativeLink(
  platform: Platform,
  id: string
): string | null {
  if (platform === 'taobao') {
    return `https://item.taobao.com/item.html?id=${id}`;
  }
  if (platform === 'weidian') {
    return `https://weidian.com/item.html?itemID=${id}`;
  }
  if (platform === '1688') {
    return `https://detail.1688.com/offer/${id}.html`;
  }
  if (platform === 'tmall') {
    return `https://detail.tmall.com/item_o.htm?id=${id}`;
  }
  return null;
}

function isBrokenRedditImageLink(current: string, platform: Platform): boolean {
  // Reddit has this weird behavior where the slash in links in galleries are omitted and no https is added.
  // https://weidian.com/item.html?itemID=4381856414&spider_token=4572
  // turns into
  // weidian.comitem.h...

  // Check for agent links
  if (current.indexOf('pandabuy.comprod') !== -1) return true;

  if (platform === 'taobao') {
    return (
      current.indexOf('item.taobao.comitem') !== -1 ||
      current.indexOf('m.intl.taobao.comdetail') !== -1
    );
  }
  if (platform === 'weidian') {
    return (
      current.indexOf('weidian.comitem') !== -1 ||
      current.indexOf('weidian.comfast') !== -1
    );
  }
  if (platform === '1688') {
    return (
      current.indexOf('m.1688.com...') !== -1 ||
      current.indexOf('detail.1688.com...') !== -1
    );
  }
  if (platform === 'tmall') {
    return current.indexOf('detail.tmall.comitem') !== -1;
  }
  return false;
}

function getImageAgent(agent: Agent) {
  const src = `assets/agent_logos/${agent}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src
  )}" style="vertical-align:middle; padding-left: 4px; padding-right: 4px">`;
}

function getPlatformImage(platform: Platform) {
  const src = `assets/platform_logos/${platform.toLowerCase()}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src
  )}" style="vertical-align:middle; padding-left: 4px; padding-right: 4px">`;
}

function shouldAddTextContent(current: string, platform: Platform): boolean {
  return (
    current.startsWith('https://') ||
    // current === `${agent} link` ||
    isBrokenRedditImageLink(current, platform)
  );
}

function getTextContent(agent: Agent) {
  return `${agent} link`;
}

async function getDetails(
  platform: Platform,
  id: string
): Promise<ApiResponse<Details> | null> {
  const d = await fetchData(
    `https://api.reparchive.com/livefeed/details/item/${platform}/${id}`
  );
  return d;
}

async function getQcAvailable(
  platform: Platform,
  id: string
): Promise<QcAvailable | null> {
  const link = buildPlatformNativeLink(platform, id);
  if (!link) {
    return null;
  }
  const url = `https://product2.rep.ninja/checkforqc?key=reparchiveqctest&url=${encodeURIComponent(
    link
  )}`;
  const d = await fetchData(url);
  return {
    ...d,
    link: `https://qc.photos/?url=${encodeURIComponent(link)}`,
  };
}

function buildDetailsElement(text: string, nowrap?: boolean) {
  const elem = document.createElement('span');
  elem.style.backgroundColor = '#2bb675';
  elem.style.color = 'white';
  elem.style.paddingLeft = '3px';
  elem.style.paddingRight = '3px';
  elem.style.paddingTop = '1px';
  elem.style.paddingBottom = '1px';
  elem.style.marginLeft = '0.3rem';
  elem.textContent = text;
  if (nowrap) {
    elem.style.display = 'inline-block';
    elem.style.whiteSpace = 'nowrap';
  }
  return elem;
}

function buildImageElement(
  link: HTMLAnchorElement,
  src: string,
  platform?: Platform
) {
  const imageContainer = document.createElement('a');
  imageContainer.href = src;
  imageContainer.target = '_blank';
  imageContainer.rel = 'norefferer noopener';

  const imageElement = document.createElement('img');
  imageElement.src = platform === 'taobao' ? `${src}_16x16.jpg` : src;
  imageElement.style.width = '16px';
  imageElement.style.height = '16px';
  imageElement.style.marginLeft = '0.3rem';
  imageElement.style.padding = '1px';
  imageElement.style.verticalAlign = 'middle';

  imageContainer.appendChild(imageElement);
  return imageContainer;
}

// function buildExpandingImageElement(link: HTMLAnchorElement, src: string) {
//   // Experimental
//   const imageContainer = document.createElement('div');
//   imageContainer.style.position = 'relative';
//   imageContainer.style.display = 'inline-block';
//   imageContainer.style.verticalAlign = 'middle';

//   const imageElement = document.createElement('img');
//   imageElement.src = src;
//   imageElement.style.display = 'block';
//   imageElement.style.width = '16px';
//   imageElement.style.height = '16px';
//   imageElement.style.marginLeft = '0.3rem';
//   imageElement.style.padding = '1px';

//   imageContainer.appendChild(imageElement);

//   const expandedImageElement = document.createElement('img');
//   expandedImageElement.src = src;
//   expandedImageElement.style.display = 'none';
//   expandedImageElement.style.position = 'absolute';
//   expandedImageElement.style.right = '0';
//   expandedImageElement.style.left = 'auto';
//   expandedImageElement.style.top = '0';
//   expandedImageElement.style.bottom = 'auto';
//   expandedImageElement.style.width = '320px';
//   expandedImageElement.style.height = '320px';
//   expandedImageElement.style.zIndex = '1';

//   imageContainer.appendChild(expandedImageElement);

//   // Add the image container to the DOM before or after the link
//   link.parentNode?.insertBefore(imageContainer, link.nextSibling);

//   // Add hover effect to expand the image
//   imageContainer.addEventListener('mouseenter', () => {
//     expandedImageElement.style.display = 'block';
//     const { parentNode } = imageContainer;
//     if (!parentNode) return;
//     const parentRect = (parentNode as HTMLElement).getBoundingClientRect();
//     const expandedImageRect = expandedImageElement.getBoundingClientRect();
//     if (expandedImageRect.right > parentRect.right) {
//       expandedImageElement.style.right = 'auto';
//       expandedImageElement.style.left = '0';
//     }
//     if (expandedImageRect.bottom > parentRect.bottom) {
//       expandedImageElement.style.top = 'auto';
//       expandedImageElement.style.bottom = '0';
//     }
//   });

//   imageContainer.addEventListener('mouseleave', () => {
//     expandedImageElement.style.display = 'none';
//   });

//   return imageContainer;
// }

function addHtmlOnlineElements(
  settings: Settings,
  details: Details,
  link: HTMLAnchorElement,
  platform: Platform
) {
  // Reverse order

  if (settings.showTitle && !settings.displayOverwriteTitle) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        settings.displayTitleLength &&
          parseInt(settings.displayTitleLength, 10) > 0
          ? details.item.goodsTitle.slice(
              0,
              parseInt(settings.displayTitleLength, 10)
            )
          : details.item.goodsTitle
      )
    );
  }

  if (settings.showPos && details.amountSold[30] > 0) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(`#${details.amountSold.pos}`, true)
    );
  }

  if (settings.showAmountSoldAt) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? 'all-time: ' : ''}${
          details.amountSold.at
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSold30) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? '30d: ' : ''}${
          details.amountSold[30]
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSold7) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? '7d: ' : ''}${
          details.amountSold[7]
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSold1) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? '24h: ' : ''}${
          details.amountSold[1]
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSoldSummary) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `sold: 24h: ${details.amountSold[1]} / 7d: ${details.amountSold[7]} / 30d: ${details.amountSold[30]} / all-time: ${details.amountSold.at}`
      )
    );
  }

  if (settings.showPrice) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(`¥${details.item.goodsPrice}`, true)
    );
  }

  if (settings.showThumbnail) {
    link.insertAdjacentElement(
      'afterend',
      buildImageElement(link, details.item.goodsPicUrl, platform)
    );
  }
}

function AddQcElement(qcAvailable: QcAvailable, link: HTMLAnchorElement) {
  const elem = document.createElement('a');
  elem.href = qcAvailable.link;
  elem.target = '_blank';
  elem.rel = 'nofollow norefferer noopener';
  elem.textContent = '📷';
  elem.style.textDecoration = 'None';
  link.insertAdjacentElement('afterend', elem);
}

function replaceTextContent(
  settings: Settings,
  link: HTMLAnchorElement,
  details: ApiResponse<Details> | null,
  selectedAgent: Agent,
  platform: Platform
): string {
  // If the overwrite title extra option is enabled, replace with the title from details
  if (settings.displayOverwriteTitle && details && details.data) {
    return settings.displayTitleLength &&
      parseInt(settings.displayTitleLength, 10) > 0
      ? details.data.item.goodsTitle.slice(
          0,
          parseInt(settings.displayTitleLength, 10)
        )
      : details.data.item.goodsTitle;
  }
  // Regular handling: replace with agent link
  if (link.textContent && shouldAddTextContent(link.textContent, platform)) {
    return getTextContent(selectedAgent);
  }
  // ELse: don't change
  return link.textContent ?? '';
}

async function main(settings: Settings) {
  // console.log("🚀🚀🚀🚀 Content Script Running 🚀🚀🚀🚀");
  // Get the selected agent from local storage
  const selectedAgent: Agent = settings.myAgent;
  // Find all the links on the page with "taobao.com" in the href attribute
  const links = getLinks(settings);

  links.forEach(async (elem) => {
    // This makes sure each link is only handled once.
    // TODO: Verify that this is the best way to deal with this.
    elem.dataset.reparchiveExtension = 'true';

    // Test if it is an agent link. If so, extract the inner link
    // Convert anchor tag to URL object.
    // Link is the URL object, elem is the html element (including the link)
    const link = await getLink(elem, settings);

    if (!link) {
      console.error('No link object could be extracted from link: ', elem.href);
      return false;
    }

    // Update html element
    elem.href = link.href;

    // At this point we have an URL object that contains the marketplace link

    const platform = detectPlatform(link.hostname);
    if (!platform) {
      console.error('No platform detected in link: ', link.href);
      return false;
    }
    const id = extractId(platform, link.href);
    if (!id) {
      console.error('No id could be extracted from link: ', link.href);
      return false;
    }
    const innerLink = generateProperLink(platform, id);

    const newLink = buildLink(selectedAgent, innerLink, platform, id, settings);

    // ^^ Link build finished ^^

    // Add Images
    if (settings.logoPlatform) {
      elem.insertAdjacentHTML('beforebegin', getPlatformImage(platform));
    }
    if (settings.logoAgent) {
      elem.insertAdjacentHTML('beforebegin', getImageAgent(selectedAgent));
    }

    if (newLink) {
      link.href = newLink;
      // Test: if the complete mark can be added here

      // Add details
      if (
        settings.onlineFeatures &&
        !isBrokenRedditImageLink(elem.textContent ?? '', platform)
      ) {
        const details = await getDetails(platform, id);

        if (details && details.data) {
          addHtmlOnlineElements(settings, details.data, elem, platform);
          elem.title = details.data.item.goodsTitle;
        }
        elem.textContent = replaceTextContent(
          settings,
          elem,
          details,
          selectedAgent,
          platform
        );
      } else if (
        elem.textContent &&
        shouldAddTextContent(elem.textContent, platform)
      ) {
        elem.textContent = getTextContent(selectedAgent);
      }

      // Add Qc Availability
      if (settings.onlineFeaturesQcPhotos) {
        const qcAvailable = await getQcAvailable(platform, id);
        if (qcAvailable && qcAvailable.state === 0 && qcAvailable.data) {
          AddQcElement(qcAvailable, elem);
        }
      }
    }
    return true;
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((_mutation) => {
    loadSettings().then((settings) => {
      main(settings as Settings);
    });
  });
});

const options = {
  childList: true,
  attributes: false,
  characterData: true,
  subtree: true,
  characterDataOldValue: false,
};

observer.observe(document.body, options);
// Run once when the loading is complete
window.onload = () => {
  loadSettings().then((settings) => {
    if (settings) {
      main(settings as Settings);
    }
  });
};
