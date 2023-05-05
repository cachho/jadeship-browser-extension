import type {
  ApiResponse,
  Platform,
  QcAvailable,
  Settings,
} from '../../models';
import type { Details } from '../../models/Details';
import { getDetails } from './getDetails';
import { getQcAvailable } from './getQcAvailable';

/**
 * Parallel retrieval of online features from the details api and the qc api. Respects user settings.
 * @param {Settings} settings - The settings object.
 * @param {Platform} platform - The platform to retrieve data for.
 * @param {string} id - The product ID to retrieve data for.
 * @returns {{ detailsPromise: Promise<ApiResponse<Details> | null>, qcAvailablePromise: Promise<QcAvailable | null> }} - An object containing two separate promises: detailsPromise that resolves to ApiResponse<Details> or null, and qcAvailablePromise that resolves to QcAvailable or null.
 */
export function getOnlineFeatures(
  settings: Settings,
  platform: Platform,
  id: string
): {
  promiseDetails: Promise<ApiResponse<Details> | null>;
  promiseQcAvailable: Promise<QcAvailable | null>;
} {
  const promiseDetails =
    settings.onlineFeatures && settings.onlineFeaturesQcPhotos
      ? getDetails(platform, id)
      : Promise.resolve(null);

  const promiseQcAvailable =
    settings.onlineFeatures && settings.onlineFeaturesQcPhotos
      ? getQcAvailable(platform, id)
      : Promise.resolve(null);

  return { promiseDetails, promiseQcAvailable };
}
