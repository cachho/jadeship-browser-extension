import { Config } from "../Config";
import type { CnLink } from "../models";

export function getStatsUrl(cnLink: CnLink | null): string | null {
  if (!cnLink) return null;
  const origin = new URL(Config.endpoint.details).origin;
  return `${origin}/${cnLink.marketplace}/${cnLink.id}?r=extension`;
}
