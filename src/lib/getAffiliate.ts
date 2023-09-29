import type { Agent } from 'cn-links';

import type { Settings } from '../models';

export function getAffiliate(settings: Settings, agent: Agent) {
  if (!settings.affiliateProgram || !settings.affiliateAppend) {
    // Returns null if the user set the setting to disable affiliates
    return null;
  }
  return settings.affiliate?.find((a) => {
    return a.name === agent;
  });
}
