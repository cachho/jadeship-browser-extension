import type { Agent } from 'cn-links';

export type AffiliateLink = {
  signupRef: string;
  itemRef: string;
  incentive?: string;
  signupLink?: string;
};

export type AffiliateLinks = {
  [x in Agent]: AffiliateLink;
};
