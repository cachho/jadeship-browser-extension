import type { Platform } from "../../models";

export function getPlatformImage(platform: Platform) {
  const src = `../public/platform_logos/${platform.toLowerCase()}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src,
  )}" style="display:block; width:16px; height:16px; object-fit:contain; vertical-align:middle; flex-shrink: 0">`;
}
