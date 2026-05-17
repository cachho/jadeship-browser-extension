import { Config } from "../Config";
import type { CnLink } from "../models";

export function getStatsUrl(cnLink: CnLink | null): string | null {
  if (!cnLink) return null;
  return `${Config.endpoint.details}/${cnLink.marketplace}/${cnLink.id}?r=extension`;
}
