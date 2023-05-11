import { agents } from '../models/Agent';
import { getDomainFromHostname } from './getDomainFromHostname';

export function isAgentLink(hostname: string): boolean {
  const domain = getDomainFromHostname(hostname);
  return agents.some((agent) => domain.indexOf(agent) !== -1);
}
