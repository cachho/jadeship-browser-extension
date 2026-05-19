import type { Agent, AgentWithRaw } from "../models";

export function getConvertTargets(
  selectedAgent: AgentWithRaw,
  toolbarAgents: Agent[],
): Agent[] {
  return Array.from(
    new Set(
      selectedAgent === "raw"
        ? toolbarAgents
        : [...toolbarAgents, selectedAgent],
    ),
  ) as Agent[];
}
