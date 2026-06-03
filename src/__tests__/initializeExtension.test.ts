import { describe, expect, test } from "bun:test";
import {
  getDefaultAgentSettings,
  getValidAgents,
  isStoredValueEqual,
} from "../lib/initializeExtension";
import { defaultAgentSettings, defaultSettings } from "../models/Settings";

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
        "raw",
      ],
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
      agentsInToolbar: ["kakobuy", "hipobuy", "raw"],
    });
  });

  describe("getValidAgents", () => {
    test("keeps only known agents and removes duplicates", () => {
      expect(
        getValidAgents([
          "joyagoo",
          "not-an-agent",
          "joyagoo",
          "kakobuy",
          "unknown",
        ]),
      ).toEqual(["joyagoo", "kakobuy"]);
    });

    test("returns an empty list when api data is missing", () => {
      expect(getValidAgents(undefined)).toEqual([]);
    });
  });

  test("falls back to local defaults when api data is missing", () => {
    const errors: unknown[][] = [];

    expect(
      getDefaultAgentSettings(undefined, (...args: unknown[]) => {
        errors.push(args);
      }),
    ).toEqual(defaultAgentSettings);
    expect(errors).toEqual([
      [
        "Error retrieving default agents:",
        "No default agents response received.",
      ],
    ]);
  });

  test("falls back to lib agent defaults and logs when api data is unusable", () => {
    const errors: unknown[][] = [];

    expect(
      getDefaultAgentSettings(["not-an-agent"], (...args: unknown[]) => {
        errors.push(args);
      }),
    ).toEqual(defaultAgentSettings);
    expect(errors).toEqual([
      [
        "Error retrieving default agents:",
        "No valid default agents found in API response.",
      ],
    ]);
  });
});
