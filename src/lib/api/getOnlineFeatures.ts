import type { CnLink } from 'cn-links';

import type { ApiResponse, QcAvailable, Settings } from '../../models';
import type { Details } from '../../models/Details';
import { getDetails } from './getDetails';
import { getQcAvailable } from './getQcAvailable';

/**
 * Parallel retrieval of online features from the details api and the qc api. Respects user settings.
 * @param {Settings} settings - The settings object.
 * @param {CnLink} cnLink - URL to process.
 * @returns {{ detailsPromise: Promise<ApiResponse<Details> | null>, qcAvailablePromise: Promise<QcAvailable | null> }} - An object containing two separate promises: detailsPromise that resolves to ApiResponse<Details> or null, and qcAvailablePromise that resolves to QcAvailable or null.
 */
export function getOnlineFeatures(
  settings: Settings,
  cnLink: CnLink
): {
  promiseDetails: Promise<ApiResponse<Details> | null>;
  promiseQcAvailable: Promise<QcAvailable | null>;
} {
  const promiseDetails =
    settings.onlineFeatures && settings.onlineFeaturesQcPhotos
      ? getDetails(cnLink)
      : Promise.resolve(null);

  const promiseQcAvailable =
    settings.onlineFeatures && settings.onlineFeaturesQcPhotos
      ? getQcAvailable(cnLink)
      : Promise.resolve(null);

  return { promiseDetails, promiseQcAvailable };
}
