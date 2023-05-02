import type {
  Agent,
  ApiResponse,
  Details,
  Platform,
  Settings,
} from '../../models';
import { getTextContent } from '../getTextContent';
import { isBrokenRedditImageLink } from '../isBrokenRedditImageLink';

export function replaceTextContent(
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
  if (
    (link.textContent && link.textContent.startsWith('https://')) ||
    isBrokenRedditImageLink(link.textContent ?? '', platform)
  ) {
    return getTextContent(selectedAgent);
  }
  // ELse: don't change
  return link.textContent ?? '';
}
