import type { Agent } from '../models';
import { getDomainFromHostname } from './getDomainFromHostname';

export function isAgentLink(hostname: string): boolean {
  const domain = getDomainFromHostname(hostname);
  const agents: Agent[] = [
    'cssbuy',
    'pandabuy',
    'sugargoo',
    'superbuy',
    'wegobuy',
  ];
  return agents.some((agent) => domain.indexOf(agent) !== -1);
}
