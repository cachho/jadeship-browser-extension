import type { Platform, Settings } from '../models';
import type { Details } from '../models/Details';
import { buildDetailsElement } from './buildDetailsElement';
import { buildImageElement } from './buildImageElement';

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
      buildDetailsElement(
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

  if (settings.showPos && details.amountSold[30] > 0) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(`#${details.amountSold.pos}`, true)
    );
  }

  if (settings.showAmountSoldAt) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? 'all-time: ' : ''}${
          details.amountSold.at
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSold30) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? '30d: ' : ''}${
          details.amountSold[30]
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSold7) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? '7d: ' : ''}${
          details.amountSold[7]
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSold1) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `${settings.showAmountSoldTimeframeLabel ? '24h: ' : ''}${
          details.amountSold[1]
        } sold`,
        true
      )
    );
  }

  if (settings.showAmountSoldSummary) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(
        `sold: 24h: ${details.amountSold[1]} / 7d: ${details.amountSold[7]} / 30d: ${details.amountSold[30]} / all-time: ${details.amountSold.at}`
      )
    );
  }

  if (settings.showPrice) {
    link.insertAdjacentElement(
      'afterend',
      buildDetailsElement(`¥${details.item.goodsPrice}`, true)
    );
  }

  if (settings.showThumbnail) {
    link.insertAdjacentElement(
      'afterend',
      buildImageElement(link, details.item.goodsPicUrl, platform)
    );
  }
}
