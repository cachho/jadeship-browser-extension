import { describe, expect, it } from "bun:test";
import { redirectListenerUrls } from "../data/redirectListenerUrls";
import { agents } from "../lib/cn-links";

describe("redirectListenerUrls data integrity", () => {
	it("should have an entry for every agent", () => {
		const hosts = redirectListenerUrls.map((u) => u.hostSuffix);
		agents.forEach((agent) => {
			const found = hosts.some((host) => host.includes(agent));
			if (!found) {
				throw new Error(`No redirectListenerUrl entry for agent: ${agent}`);
			}
			expect(found).toBe(true);
		});
	});

	it("should not have extra entries beyond known agents", () => {
		const hosts = redirectListenerUrls.map((u) => u.hostSuffix);
		hosts.forEach((host) => {
			const matched = agents.some((agent) => host.includes(agent));
			if (!matched) {
				throw new Error(
					`Extra redirectListenerUrl with no matching agent: ${host}`,
				);
			}
			expect(matched).toBe(true);
		});
	});

	it("should not have duplicate hostSuffix entries", () => {
		const hosts = redirectListenerUrls.map((u) => u.hostSuffix);
		const uniqueHosts = new Set(hosts);
		expect(uniqueHosts.size).toBe(hosts.length);
	});

	it("should match the expected static order", () => {
		const hosts = redirectListenerUrls.map((u) => u.hostSuffix);
		const expected = [
			"wegobuy.com",
			"superbuy.com",
			"sugargoo.com",
			"cssbuy.com",
			"pandabuy.com",
			"hagobuy.com",
			"hegobuy.com",
			"kameymall.com",
			"ezbuycn.com",
			"cnfans.com",
			"hoobuy.com",
			"allchinabuy.com",
			"acbuy.com",
			"basetao.com",
			"mulebuy.com",
			"eastmallbuy.com",
			"hubbuycn.com",
			"joyabuy.com",
			"joyagoo.com",
			"orientdig.com",
			"oopbuy.com",
			"lovegobuy.com",
			"blikbuy.com",
			"panglobalbuy.com",
			"ponybuy.com",
			"sifubuy.com",
			"loongbuy.com",
			"kakobuy.com",
			"itaobuy.com",
			"usfans.com",
			"cnshopper.com",
			"hipobuy.com",
			"gtbuy.com",
			"fishgoo.com",
		];
		expect(hosts).toEqual(expected);
	});

	it("each entry should have a non-empty hostSuffix string", () => {
		redirectListenerUrls.forEach((entry) => {
			expect(typeof entry.hostSuffix).toBe("string");
			expect(entry.hostSuffix.length).toBeGreaterThan(0);
		});
	});
});
