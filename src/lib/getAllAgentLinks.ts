import type { AgentWithRaw, Platform, Settings } from '../models';
import { agents } from '../models/Agent';
import { generateAgentLink } from './generateAgentLink';

export function getAllAgentLinks(
  innerLink: string,
  platform: Platform,
  id: string,
  settings?: Settings
) {
  const allAgents = [...agents, 'raw'] as AgentWithRaw[];

  const agentLinks = allAgents.reduce((obj, agent) => {
    return {
      ...obj,
      [agent]: generateAgentLink(agent, innerLink, platform, id, settings),
    };
  }, {} as { [agent in AgentWithRaw]: string });

  return agentLinks;
}
