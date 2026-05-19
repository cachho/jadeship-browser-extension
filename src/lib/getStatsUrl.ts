import { Config } from "../Config";
import type { CnLink } from "../models";
import { isValidCnLink } from "./isValidCnLink";

export function getStatsUrl(
  cnLink: Partial<CnLink> | null | undefined,
): string | null {
  if (!isValidCnLink(cnLink)) return null;
  const origin = new URL(Config.endpoint.details).origin;
  return `${origin}/item/${cnLink.marketplace}/${cnLink.id}?r=extension`;
}
