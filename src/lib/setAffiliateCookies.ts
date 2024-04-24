import { type Agent, agents } from 'cn-links';

import { Config } from '../Config';
import type { AffiliateLink, AffiliateLinks } from '../models';

export function getCookie(
  isChrome: boolean,
  agent: Agent,
  affiliate: AffiliateLink
): null | browser.cookies._SetDetails[] | chrome.cookies.SetDetails[] {
  const shared = {
    value: affiliate.signupRef,
    path: '/',
    expirationDate: 1893456000,
  };
  if (agent === 'hoobuy') {
    return [
      {
        ...shared,
        url: 'https://hoobuy.com',
        domain: 'hoobuy.com',
        name: 'inviteCode',
      },
    ];
  }
  if (agent === 'sugargoo') {
    return null;
  }
  if (agent === 'wegobuy') {
    return [
      {
        ...shared,
        url: 'https://www.wegobuy.com',
        domain: '.wegobuy.com',
        name: 'wegobuyLoginInviteCode',
      },
    ];
  }
  if (agent === 'superbuy') {
    return [
      {
        ...shared,
        url: 'https://www.superbuy.com',
        domain: '.superbuy.com',
        name: 'superbuyLoginInviteCode',
      },
    ];
  }
  if (agent === 'cssbuy') {
    if (!affiliate.cookie) {
      console.error('Agent cssbuy has no cookie key');
      return null;
    }
    const obj = JSON.parse(affiliate.cookie);
    return [
      {
        ...shared,
        url: 'https://www.cssbuy.com',
        domain: 'www.cssbuy.com',
        name: Object.keys(obj)[0],
        value: Object.values(obj)[0] as string,
      },
      {
        ...shared,
        url: 'https://www.cssbuy.com',
        domain: '.cssbuy.com',
        name: 'refererurl',
        value: encodeURIComponent(`${Config.host.details}/tools/extension`),
      },
    ];
  }
  if (agent === 'hagobuy') {
    return [
      {
        ...shared,
        url: 'https://www.hagobuy.com',
        domain: '.hagobuy.com',
        name: 'AFFCODE',
      },
    ];
  }
  if (agent === 'pandabuy') {
    return null;
  }
  return null;
}

export async function setAffiliateCookies(
  isChrome: boolean,
  affiliateLinks: AffiliateLinks
) {
  agents.forEach((agent) => {
    const values = getCookie(isChrome, agent, affiliateLinks[agent]);
    if (values && values.length > 0) {
      if (isChrome) {
        values.map((value) => chrome.cookies?.set(value));
      } else {
        values.map((value) =>
          chrome.cookies?.set({ ...value, sameSite: 'no_restriction' })
        );
      }
    }
  });

  return null;
}
