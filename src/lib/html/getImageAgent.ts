import type { AgentWithRaw } from "../../models";

export function getImageAgent(agent: AgentWithRaw) {
  if (agent === "raw") {
    return `<span style="vertical-align:middle; padding: 0 6px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7)">Raw</span>`;
  }
  const src = `../public/agent_logos/${agent}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src,
  )}" style="vertical-align:middle; padding-left: 4px; padding-right: 4px">`;
}
