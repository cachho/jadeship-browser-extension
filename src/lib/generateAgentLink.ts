import type { AgentWithRaw, Platform, Settings } from '../models';
import { generateProperLink } from './generateProperLink';
import { getAffiliate } from './getAffiliate';

export function generateAgentLink(
  agent: AgentWithRaw,
  innerLink: string,
  platform: Platform,
  id: string,
  settings: Settings
) {
  const urlParams = new URLSearchParams();
  // Get affiliates object from local storage
  const aff = agent !== 'raw' ? getAffiliate(settings, agent) : null;

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
  if (agent === 'raw') {
    return generateProperLink(platform, id);
  }
  return '';
}
