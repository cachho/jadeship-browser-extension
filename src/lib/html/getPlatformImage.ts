import type { Platform } from '../../models';

export function getPlatformImage(platform: Platform) {
  const src = `../public/platform_logos/${platform.toLowerCase()}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src
  )}" style="vertical-align:middle; padding-left: 4px; padding-right: 4px; height: 16px; width: 16px; flex-shrink: 0">`;
}
