import type { Affiliate } from './Affiliate';
import type { Agent } from './Agent';

export const settingNames = [
  'taobaoLink',
  'weidianLink',
  's1688Link',
  'tmallLink',
  'agentLink',
  'logoAgent',
  'logoPlatform',
  'myAgent',
  'affiliateProgram',
  'affiliateAppend',
  'onlineFeatures',
  'onlineFeaturesQcPhotos',
  'masterToggle',
  'showThumbnail',
  'showPrice',
  'showAmountSoldSummary',
  'showAmountSold1',
  'showAmountSold7',
  'showAmountSold30',
  'showAmountSoldAt',
  'showAmountSoldTimeframeLabel',
  'showPos',
  'showTitle',
  'displayTitleLength',
  'displayOverwriteTitle',
  'affiliate',
];

export type Settings = {
  agentLink: boolean;
  affiliateProgram: boolean;
  affiliateAppend: boolean;
  logoAgent: boolean;
  logoPlatform: boolean;
  myAgent: Agent;
  taobaoLink: boolean;
  weidianLink: boolean;
  s1688Link: boolean;
  tmallLink: boolean;
  onlineFeatures: boolean;
  onlineFeaturesQcPhotos: boolean;
  showThumbnail: boolean;
  showPrice: boolean;
  showAmountSoldSummary: boolean;
  showAmountSold1: boolean;
  showAmountSold7: boolean;
  showAmountSold30: boolean;
  showAmountSoldAt: boolean;
  showAmountSoldTimeframeLabel: boolean;
  showPos: boolean;
  showTitle: boolean;
  displayTitleLength: string;
  displayOverwriteTitle: boolean;
  affiliate?: Affiliate[];
};

export const defaultSettings: Settings = {
  agentLink: true,
  affiliateProgram: true,
  affiliateAppend: false,
  logoAgent: false,
  logoPlatform: true,
  myAgent: 'wegobuy',
  taobaoLink: true,
  weidianLink: true,
  s1688Link: true,
  tmallLink: true,
  onlineFeatures: true,
  onlineFeaturesQcPhotos: true,
  showThumbnail: true,
  showPrice: true,
  showAmountSoldSummary: false,
  showAmountSold1: false,
  showAmountSold7: false,
  showAmountSold30: true,
  showAmountSoldAt: false,
  showAmountSoldTimeframeLabel: false,
  showPos: false,
  showTitle: true,
  displayTitleLength: '64',
  displayOverwriteTitle: false,
};