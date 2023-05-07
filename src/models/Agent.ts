export const agents = [
  'superbuy',
  'wegobuy',
  'pandabuy',
  'sugargoo',
  'cssbuy',
] as const;

export type Agent = (typeof agents)[number];

export type AgentWithRaw = Agent | 'raw';
