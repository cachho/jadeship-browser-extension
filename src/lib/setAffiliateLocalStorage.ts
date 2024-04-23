import type { Agent } from 'cn-links';
import { detectAgent } from 'cn-links';

import type { AffiliateLink, AffiliateLinks } from '../models';

type LocalStorageKV = { [x in string]: string };

class LocalStorage {
  static set(obj: LocalStorageKV) {
    window.localStorage.setItem(Object.keys(obj)[0], Object.values(obj)[0]);
  }
}

export function setCookie(
  agent: Agent,
  affiliate: AffiliateLink
): null | boolean {
  if (agent === 'hoobuy') {
    return true;
  }
  if (agent === 'sugargoo') {
    if (!affiliate.localStorage) {
      console.error('Agent sugargoo has no localStorage key');
      return false;
    }
    LocalStorage.set(JSON.parse(affiliate.localStorage));
  } else if (agent === 'pandabuy') {
    const value = {
      inviteCode: affiliate.signupRef,
      setTime: new Date().getTime(),
    };
    LocalStorage.set({ INVITECODE: JSON.stringify(value) });
  } else if (agent === 'superbuy') {
    return null;
  } else if (agent === 'wegobuy') {
    return null;
  } else if (agent === 'hagobuy') {
    return null;
  } else if (agent === 'cssbuy') {
    return null;
  } else {
    console.log(`Agent ${agent} has no known affiliate key`);
  }

  return null;
}

export async function setAffiliateLocalStorage(
  affiliateLinks: AffiliateLinks,
  currentUrl: URL
) {
  const agent = detectAgent(currentUrl);
  if (!agent) {
    console.error('No agent detected');
    return null;
  }
  setCookie(agent, affiliateLinks[agent]);
  return null;
}
