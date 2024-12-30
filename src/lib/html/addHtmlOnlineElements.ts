import type { Platform, Settings } from '../../models';
import type { Details } from '../../models/Details';
import { addDetailsElement } from './addDetailsElement';
import { addImageElement } from './addImageElement';

export function addHtmlOnlineElements(
  settings: Settings,
  details: Details,
  link: HTMLAnchorElement,
  platform: Platform
) {
  // Reverse order

  if (settings.showTitle && !settings.displayOverwriteTitle) {
    link.insertAdjacentElement(
      'afterend',
      addDetailsElement(
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

  if (settings.showPos && details.amountSold.pos < 1000) {
    link.insertAdjacentElement(
      'afterend',
      addDetailsElement(`#${details.amountSold.pos}`, true)
    );
  }

  if (
    settings.showAmountSold &&
    details.amountSold !== undefined &&
    details.amountSold !== null
  ) {
    link.insertAdjacentElement(
      'afterend',
      addDetailsElement(`${details.amountSold.count} sold`, true)
    );
  }

  if (settings.showPrice) {
    link.insertAdjacentElement(
      'afterend',
      addDetailsElement(`¥${details.item.goodsPrice}`, true)
    );
  }

  if (settings.showThumbnail) {
    link.insertAdjacentElement(
      'afterend',
      addImageElement(link, details.item.goodsPicUrl, platform)
    );
  }
}
