import { agents } from 'cn-links';

import { getTargetHrefs } from '../lib/getTargetHrefs';
import { defaultSettings } from '../models/Settings';

describe('getTargetHrefs', () => {
  it('should include all agents at least once as a targeted href', () => {
    const targetedHrefs = getTargetHrefs(defaultSettings);
    // For each agent, check if it's a part of a string in targetedHrefs
    // If it's not, the test will fail
    agents.forEach((agent) => {
      const found = targetedHrefs.some((href) => href.includes(agent));
      if (!found) {
        throw new Error(`Agent not found: ${agent}`);
      }
      expect(found).toBe(true);
    });
  });
});
