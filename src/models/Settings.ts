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
  'showAmountSold',
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
  showAmountSold: boolean;
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
  showAmountSold: true,
  showPos: false,
  showTitle: true,
  displayTitleLength: '64',
  displayOverwriteTitle: false,
  showToolbar: true,
  stickyToolbar: true,
  isDefault: true,
  agentsInToolbar: ['mulebuy', 'allchinabuy', 'hoobuy', 'sugargoo', 'cssbuy'],
};
