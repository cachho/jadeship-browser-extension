import type { CnLink } from "../models";
import { marketplaces } from "../models/Marketplace";

export function hasValidMarketplaceAndId(
  marketplace: unknown,
  id: unknown,
): marketplace is CnLink["marketplace"] {
  return (
    typeof marketplace === "string" &&
    marketplaces.includes(marketplace as CnLink["marketplace"]) &&
    typeof id === "string" &&
    id.length > 0 &&
    id !== "undefined"
  );
}

export function isValidCnLink(
  cnLink: Partial<CnLink> | null | undefined,
): cnLink is CnLink {
  return hasValidMarketplaceAndId(cnLink?.marketplace, cnLink?.id);
}
