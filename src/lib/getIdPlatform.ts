import { extractId } from 'cn-links';

import type { Agent, Platform } from '../models';
import { decryptCssbuy } from './decryptCssbuy';
import { detectPlatform } from './detectPlatform';
import { extractInnerLink } from './extractInnerLink';

/**
 * From either agent or platform, return an object of id and platform.
 * @param currentHref {String} Current link
 * @param agent {Agent} Optional agent
 * @param platform {Platform} Optional platform
 * @returns {id: string | null, platform: Platform | null} Id and platform. Null if not obtainable.
 */
export function getIdPlatform(
  currentHref: string,
  agent?: Agent,
  platform?: Platform
): { id: string | null; platform: Platform | null } {
  if (agent) {
    const innerLink =
      agent !== 'cssbuy'
        ? extractInnerLink(new URL(currentHref))
        : decryptCssbuy(new URL(currentHref));
    if (!innerLink) {
      return { id: null, platform: null };
    }
    const innerLinkPlatform = detectPlatform(innerLink?.hostname);
    if (!innerLinkPlatform) {
      return { id: null, platform: null };
    }
    const id = extractId(innerLink, innerLinkPlatform);
    if (!id) {
      return { id: null, platform: null };
    }
    return { id, platform: innerLinkPlatform };
  }
  if (platform) {
    const id = extractId(currentHref, platform);
    if (!id) {
      return { id: null, platform: null };
    }
    return { id, platform };
  }
  return { id: null, platform: null };
}
