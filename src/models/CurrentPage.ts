import type { Agent } from "./Agents";
import type { CnLink } from "./CnLink";
import type { Marketplace } from "./Marketplace";

export type CurrentPage = {
  link: CnLink;
  agent: Agent | undefined;
  marketplace: Marketplace | undefined;
};
