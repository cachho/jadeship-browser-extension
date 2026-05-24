import type { AgentWithRaw } from "../../models";

export function getImageAgent(agent: AgentWithRaw) {
  if (agent === "raw") {
    return '<span style="color:#e5e7eb;font-size:11px;font-weight:700;padding:0 8px;text-transform:uppercase;letter-spacing:0.03em">Raw</span>';
  }
  const src = `../public/agent_logos/${agent}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src,
  )}" style="vertical-align:middle; padding-left: 4px; padding-right: 4px">`;
}
