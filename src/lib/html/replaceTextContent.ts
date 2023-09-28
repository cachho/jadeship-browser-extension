import type { AgentWithRaw } from 'cn-links';

import type { ApiResponse, Details, Platform, Settings } from '../../models';
import { isBrokenRedditImageLink } from '../isBrokenRedditImageLink';

export function replaceTextContent(
  settings: Settings,
  link: HTMLAnchorElement,
  details: ApiResponse<Details> | null,
  selectedAgent: AgentWithRaw,
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
  if (
    (link.textContent && link.textContent.startsWith('https://')) ||
    isBrokenRedditImageLink(link.textContent ?? '', platform)
  ) {
    // For regular agents, use the agent name + link, if raw is selected use the target platform instead.
    return `${selectedAgent !== 'raw' ? selectedAgent : platform} link`;
  }
  // Else: don't change
  return link.textContent ?? '';
}
