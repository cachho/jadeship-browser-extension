import { agents } from 'cn-links';

import manifest from '../../manifest.json';
import manifestv2 from '../../manifest-v2.json';

describe('Agents', () => {
  it('should include the agent in manifest v3', () => {
    const webAccessibleResources =
      manifest.web_accessible_resources[0].matches.join(', ');
    const contentScripts = manifest.content_scripts[0].matches.join(', ');
    const hostPermissions = manifest.host_permissions.join(', ');

    agents.forEach((agent) => {
      // Read manifest.json file and check if the agent is listed in web_accessible_resources[0].matches
      expect(webAccessibleResources).toContain(agent);
      expect(contentScripts).toContain(agent);
      expect(hostPermissions).toContain(agent);
    });
  });

  it('should include the agent in manifest v2', () => {
    const contentScripts = manifestv2.content_scripts[1].matches.join(', ');
    const permissions = manifestv2.permissions.join(', ');

    agents.forEach((agent) => {
      // Read manifest.json file and check if the agent is listed in web_accessible_resources[0].matches
      expect(contentScripts).toContain(agent);
      expect(permissions).toContain(agent);
    });
  });
});
