import type { Agent, AgentWithRaw } from "../models";

export function getConvertTargets(
  selectedAgent: AgentWithRaw,
  toolbarAgents: AgentWithRaw[],
): Agent[] {
  const agentOnlyToolbarAgents = toolbarAgents.filter(
    (a): a is Agent => a !== "raw",
  );
  return Array.from(
    new Set(
      selectedAgent === "raw"
        ? agentOnlyToolbarAgents
        : [...agentOnlyToolbarAgents, selectedAgent],
    ),
  ) as Agent[];
}
