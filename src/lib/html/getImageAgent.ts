import type { Agent } from "../../models";

export function getImageAgent(agent: Agent) {
  const src = `../public/agent_logos/${agent}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src,
  )}" style="display:block; width:16px; height:16px; object-fit:contain; vertical-align:middle;">`;
}
