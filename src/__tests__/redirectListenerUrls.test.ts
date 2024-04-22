import { agents } from 'cn-links';

import { redirectListenerUrls } from '../data/redirectListenerUrls';

describe('redirectListenerUrls', () => {
  it('should redirect for all agents', () => {
    const hosts = redirectListenerUrls.map((url) => url.hostSuffix);
    agents.forEach((agent) => {
      // Check if the agent is part of any of the host strings
      const found = hosts.some((host) => host.includes(agent));
      if (!found) {
        throw new Error(`Agent not found: ${agent}`);
      }
      expect(found).toBe(true);
    });
  });
});
