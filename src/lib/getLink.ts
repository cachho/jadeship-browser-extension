import type { Settings } from '../models';
import { extractInnerLink } from './extractInnerLink';
import { handleShortenedLink } from './handleShortenedLink';
import { isAgentLink } from './isAgentLink';

export async function getLink(
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
