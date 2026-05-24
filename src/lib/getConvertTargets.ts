import type { Agent, AgentWithRaw } from "../models";

export function getConvertTargets(
  selectedAgent: AgentWithRaw,
  toolbarAgents: AgentWithRaw[],
): Agent[] {
  return Array.from(
    new Set(
      selectedAgent === "raw"
        ? toolbarAgents.filter((agent): agent is Agent => agent !== "raw")
        : [...toolbarAgents, selectedAgent].filter(
            (agent): agent is Agent => agent !== "raw",
          ),
    ),
  ) as Agent[];
}
