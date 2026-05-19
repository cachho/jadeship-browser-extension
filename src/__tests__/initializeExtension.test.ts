import { describe, expect, test } from "bun:test";

import { Config } from "../Config";
import {
  getDefaultAgentSettings,
  isStoredValueEqual,
} from "../lib/initializeExtension";
import { defaultSettings } from "../models/Settings";

describe("isStoredValueEqual", () => {
  test("matches primitive settings values", () => {
    expect(isStoredValueEqual(true, true)).toBe(true);
    expect(
      isStoredValueEqual(defaultSettings.myAgent, defaultSettings.myAgent),
    ).toBe(true);
  });

  test("matches array settings values by content", () => {
    const storedValue = [...defaultSettings.agentsInToolbar];
    expect(storedValue).not.toBe(defaultSettings.agentsInToolbar);
    expect(
      isStoredValueEqual(storedValue, defaultSettings.agentsInToolbar),
    ).toBe(true);
  });

  test("does not match different array values", () => {
    expect(
      isStoredValueEqual(
        [...defaultSettings.agentsInToolbar, "cnfans"],
        defaultSettings.agentsInToolbar,
      ),
    ).toBe(false);
  });
});

describe("getDefaultAgentSettings", () => {
  test("uses the api order for my agent and toolbar defaults", () => {
    expect(
      getDefaultAgentSettings([
        "lovegobuy",
        "joyagoo",
        "kakobuy",
        "hipobuy",
        "acbuy",
        "mulebuy",
        "ponybuy",
      ]),
    ).toEqual({
      myAgent: "lovegobuy",
      agentsInToolbar: [
        "joyagoo",
        "kakobuy",
        "hipobuy",
        "acbuy",
        "mulebuy",
      ].slice(0, Config.defaultToolbarAgentsCount),
    });
  });

  test("filters unknown and duplicate agents before applying defaults", () => {
    expect(
      getDefaultAgentSettings([
        "not-an-agent",
        "joyagoo",
        "joyagoo",
        "kakobuy",
        "unknown",
        "hipobuy",
      ]),
    ).toEqual({
      myAgent: "joyagoo",
      agentsInToolbar: ["kakobuy", "hipobuy"],
    });
  });

  test("falls back to local defaults when api data is missing", () => {
    expect(getDefaultAgentSettings()).toEqual({
      myAgent: defaultSettings.myAgent,
      agentsInToolbar: defaultSettings.agentsInToolbar,
    });
  });
});
