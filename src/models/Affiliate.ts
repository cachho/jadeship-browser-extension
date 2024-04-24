import type { Agent } from 'cn-links';

export type AffiliateLink = {
  signupRef: string;
  itemRef: string;
  incentive?: string;
  signupLink?: string;
  localStorage?: string;
  cookie?: string;
};

export type AffiliateLinks = {
  [x in Agent]: AffiliateLink;
};
