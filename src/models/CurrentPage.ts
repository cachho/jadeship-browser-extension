import type { Agent, CnLink, Marketplace } from 'cn-links';

export type CurrentPage = {
  link: CnLink;
  agent: Agent | undefined;
  marketplace: Marketplace | undefined;
};
