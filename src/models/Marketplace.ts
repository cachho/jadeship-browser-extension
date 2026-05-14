export const marketplaces = ['weidian', 'taobao', '1688', 'tmall'] as const;
export const marketplacesWithTld = [
  'weidian.com',
  'taobao.com',
  '1688.com',
  'tmall.com',
] as const;

export type Marketplace = (typeof marketplaces)[number];
export type MarketplaceWithTld = (typeof marketplacesWithTld)[number];

export const nonLinkMarketplaces = ['yupoo'] as const;
export const nonLinkMarketplacesWithTld = ['yupoo.com'] as const;

export type NonLinkMarketplace = (typeof nonLinkMarketplaces)[number];
export type NonLinkMarketplaceWithTld =
  (typeof nonLinkMarketplacesWithTld)[number];

export const marketplacesWithNonLinkMarketplaces = [
  ...marketplaces,
  ...nonLinkMarketplaces,
] as const;

export const marketplacesWithNonLinkMarketplacesWithTld = [
  ...marketplacesWithTld,
  ...nonLinkMarketplacesWithTld,
] as const;

export type MarketplaceWithNonLinkMarketplace =
  | Marketplace
  | NonLinkMarketplace;

export type MarketplaceWithNonLinkMarketplaceWithTld =
  | MarketplaceWithTld
  | NonLinkMarketplaceWithTld;
