import type { Agent, AgentWithRaw } from 'cn-links';

import type { AffiliateLinks } from '.';

export const settingNames: (keyof Settings)[] = [
  'taobaoLink',
  'weidianLink',
  's1688Link',
  'tmallLink',
  'agentLink',
  'thirdPartyLink',
  'logoAgent',
  'logoPlatform',
  'myAgent',
  'affiliateProgram',
  'affiliateAppend',
  'onlineFeatures',
  'onlineFeaturesQcPhotos',
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
  'showToolbar',
  'stickyToolbar',
  'agentsInToolbar',
  'isDefault',
];

export type Settings = {
  agentLink: boolean;
  thirdPartyLink: boolean;
  affiliateProgram: boolean;
  affiliateAppend: boolean;
  logoAgent: boolean;
  logoPlatform: boolean;
  myAgent: AgentWithRaw;
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
  affiliate?: AffiliateLinks | null;
  showToolbar: boolean;
  stickyToolbar: boolean;
  isDefault: boolean;
  agentsInToolbar: Agent[];
};

export const defaultSettings: Settings = {
  agentLink: true,
  thirdPartyLink: true,
  affiliateProgram: true,
  affiliateAppend: false,
  logoAgent: false,
  logoPlatform: true,
  myAgent: 'lovegobuy',
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
  showToolbar: true,
  stickyToolbar: true,
  isDefault: true,
  agentsInToolbar: ['mulebuy', 'allchinabuy', 'hoobuy', 'sugargoo', 'cssbuy'],
};
