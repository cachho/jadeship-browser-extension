import { describe, expect, it } from "bun:test";
import { Config } from "../Config";
import { agents, regularAgents } from "../lib/cn-links/agents";
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
  it("should derive fallback defaults from the shared regular agents list", () => {
    expect(regularAgents.every((agent) => agents.includes(agent))).toBe(true);
    expect(defaultAgentSettings).toEqual({
      myAgent: regularAgents[0],
      agentsInToolbar: [
        ...regularAgents.slice(1, 1 + Config.defaultToolbarAgentsCount),
      ],
    });
    expect(defaultSettings.myAgent).toBe(regularAgents[0]);
    expect(defaultSettings.agentsInToolbar).toEqual(
      defaultAgentSettings.agentsInToolbar,
    );
  });
});
