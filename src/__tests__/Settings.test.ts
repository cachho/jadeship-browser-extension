import { describe, expect, it } from "bun:test";
import { Config } from "../Config";
import { agents } from "../lib/cn-links/agents";
import type { Settings } from "../models/Settings";
import {
  defaultAgentSettings,
  defaultSettings,
  settingNames,
} from "../models/Settings";

describe("Settings type keys", () => {
  it("should have all keys present in the settingNames array", () => {
    // Extract keys
    const settingsKeys = Object.keys(defaultSettings);

    // Find missing keys
    const missingKeys = settingsKeys.filter(
      (key) => !settingNames.includes(key as keyof Settings),
    );

    // Check if there are no missing keys
    expect(missingKeys).toEqual([]);
  });
});

describe("default agent settings", () => {
  it("should derive fallback defaults from the shared agents list", () => {
    const fallbackAgents = agents.filter((agent) =>
      [
        "cnfans",
        "mulebuy",
        "allchinabuy",
        "hoobuy",
        "sugargoo",
        "acbuy",
      ].includes(agent),
    );

    expect(defaultAgentSettings).toEqual({
      myAgent: fallbackAgents[0],
      agentsInToolbar: [
        ...fallbackAgents.slice(1, 1 + Config.defaultToolbarAgentsCount),
      ],
    });
    expect(defaultSettings.myAgent).toBe(fallbackAgents[0]);
    expect(defaultSettings.agentsInToolbar).toEqual(
      defaultAgentSettings.agentsInToolbar,
    );
  });
});
