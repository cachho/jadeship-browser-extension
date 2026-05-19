import { describe, expect, it } from "bun:test";
import { agents, agentsWithRaw } from "../lib/cn-links/agents";

describe("agents data integrity", () => {
	it("should have no duplicate agent names", () => {
		const uniqueAgents = new Set(agents);
		expect(uniqueAgents.size).toBe(agents.length);
	});

	it("should match the expected static order", () => {
		const expected = [
			"superbuy",
			"wegobuy",
			"pandabuy",
			"sugargoo",
			"cssbuy",
			"hagobuy",
			"basetao",
			"kameymall",
			"cnfans",
			"ezbuycn",
			"hoobuy",
			"allchinabuy",
			"mulebuy",
			"eastmallbuy",
			"hubbuycn",
			"joyabuy",
			"orientdig",
			"oopbuy",
			"lovegobuy",
			"blikbuy",
			"hegobuy",
			"ponybuy",
			"panglobalbuy",
			"sifubuy",
			"loongbuy",
			"kakobuy",
			"acbuy",
			"joyagoo",
			"itaobuy",
			"usfans",
			"cnshopper",
			"hipobuy",
			"gtbuy",
			"fishgoo",
		];
		expect(agents).toEqual(expected);
	});

	it("should have at least 30 agents", () => {
		expect(agents.length).toBeGreaterThanOrEqual(30);
	});

	it("agentsWithRaw should include all agents plus 'raw'", () => {
		expect(agentsWithRaw.slice(0, -1)).toEqual(agents);
		expect(agentsWithRaw[agentsWithRaw.length - 1]).toBe("raw");
		expect(agentsWithRaw.length).toBe(agents.length + 1);
	});

	it("each agent name should be a non-empty string", () => {
		agents.forEach((agent) => {
			expect(typeof agent).toBe("string");
			expect(agent.length).toBeGreaterThan(0);
		});
	});

	it("no agent name should be a substring of another agent name", () => {
		for (let i = 0; i < agents.length; i++) {
			for (let j = 0; j < agents.length; j++) {
				if (i !== j && agents[i].includes(agents[j])) {
					throw new Error(`"${agents[j]}" is a substring of "${agents[i]}"`);
				}
			}
		}
	});
});
