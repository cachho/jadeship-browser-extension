import type { Agent } from './Agent';

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
