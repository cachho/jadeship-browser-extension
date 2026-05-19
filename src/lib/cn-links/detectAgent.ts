import type { Agent } from "../../models";
import { agents } from "./agents";

/**
 * Detects the agent based on the provided URL.
 *
 * @param {URL | string} href - The URL to detect the agent from.
 * @returns {Agent | undefined} The detected agent, or undefined if no agent is detected.
 */
export function detectAgent(href: URL | string): Agent | undefined {
	const link = typeof href === "string" ? new URL(href) : href;

	// Find agent in hostname
	const agent = agents.find((a) => {
		if (link.hostname.includes(a)) {
			return true;
		}
		return false;
	});

	if (agent) {
		return agent;
	}

	return undefined;
}
