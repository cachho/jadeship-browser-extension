import type { agents, agentsWithRaw } from '../lib/cn-links/agents';

export type Agent = (typeof agents)[number];

export type AgentWithRaw = (typeof agentsWithRaw)[number];
