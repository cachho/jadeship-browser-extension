import type { Agent } from '../../models';

export function getImageAgent(agent: Agent) {
  const src = `../public/agent_logos/${agent}_logo.png`;
  return `<img src="${chrome.runtime.getURL(
    src
  )}" style="vertical-align:middle; padding-left: 4px; padding-right: 4px">`;
}
