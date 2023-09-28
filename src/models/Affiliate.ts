import type { Agent } from 'cn-links';

export type Affiliate = {
  active: boolean;
  altRef?: string;
  dateAdded: string;
  incentive?: string;
  itemUrlTaobao?: string;
  itemUrlWeidian?: string;
  name: Agent | string;
  owner: string;
  param?: string;
  ref?: string;
  tag?: string;
  url: string;
};
