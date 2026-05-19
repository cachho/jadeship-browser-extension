import { Config } from "../Config";
import type { AffiliateLinks, Agent, ApiResponse } from "../models";
import type { Settings } from "../models/Settings";
import { defaultAgentSettings, defaultSettings } from "../models/Settings";
import { fetchData } from "./api/fetchData";
import { agents } from "./cn-links/agents";
import { isChromeStorage } from "./storage";

export function isStoredValueEqual(
  value: Settings[keyof Settings] | undefined,
  defaultValue: Settings[keyof Settings],
) {
  if (Array.isArray(value) && Array.isArray(defaultValue)) {
    return (
      value.length === defaultValue.length &&
      value.every((item, index) => item === defaultValue[index])
    );
  }

  return value === defaultValue;
}

export function getDefaultAgentSettings(
  defaultAgents?: string[],
  onError: (...args: unknown[]) => void = console.error,
): Pick<Settings, "myAgent" | "agentsInToolbar"> {
  const knownAgents = new Set<string>(agents);
  const validDefaultAgents = Array.from(
    new Set(
      (defaultAgents ?? []).filter((agent): agent is Agent =>
        knownAgents.has(agent),
      ),
    ),
  );

  if (validDefaultAgents.length === 0) {
    onError(
      "Error retrieving default agents:",
      Array.isArray(defaultAgents) && defaultAgents.length > 0
        ? "No valid default agents found in API response."
        : "No default agents response received.",
    );
    return {
      myAgent: defaultAgentSettings.myAgent,
      agentsInToolbar: defaultAgentSettings.agentsInToolbar,
    };
  }

  return {
    myAgent: validDefaultAgents[0],
    agentsInToolbar: validDefaultAgents.slice(
      1,
      1 + Config.defaultToolbarAgentsCount,
    ),
  };
}

/**
 * This script initializes local storage with default values and from the api.
 * @returns void
 */
export async function initializeExtension(
  storage: typeof browser.storage | typeof chrome.storage | null,
) {
  if (!storage) {
    console.error("Storage is not available.");
    return;
  }
  const defaultAgentResponse = await fetchData<ApiResponse<string[]>>(
    Config.endpoint.defaults.agent,
  );
  const effectiveDefaults: Settings = {
    ...defaultSettings,
    ...getDefaultAgentSettings(defaultAgentResponse?.data),
  };

  // Check if we're running in Chrome
  if (isChromeStorage(storage)) {
    Object.keys(effectiveDefaults).forEach((key) => {
      if (Object.hasOwn(effectiveDefaults, key)) {
        const param: { [key: string]: Settings[keyof Settings] } = {
          [key]: null,
        };
        storage.local.get(param, (result) => {
          // Only proceed if the previous local storage does not have the key
          if (
            !Object.hasOwn(result, key) ||
            result[key] === undefined ||
            result[key] === null
          ) {
            const defaultVal = effectiveDefaults[key as keyof Settings];
            console.debug(
              `Key does not exist. Creating key '${key}' with value: ${defaultVal}`,
            );
            storage.local.set({ [key]: defaultVal });
            storage.local.get(param, (r) => {
              if (!isStoredValueEqual(r[key], defaultVal)) {
                console.error(`Setting unsuccessful: ${r[key]} ${defaultVal}`);
              }
            });
          } else {
            console.debug(
              `Key '${key}' already exists with value: ${result[key]}`,
            );
          }
        });
      }
    });
  }

  // Check if we're running in Firefox
  if (!isChromeStorage(storage)) {
    Object.keys(effectiveDefaults).forEach((key) => {
      const params: { [key: string]: Settings[keyof Settings] } = {};
      params[key] = null;
      storage.local.get(params).then((result) => {
        if (!Object.hasOwn(result, key) || !result[key]) {
          const defaultVal = effectiveDefaults[key as keyof Settings];
          storage.local.set({ [key]: defaultVal });
        }
      });
    });
  }

  // Only get links if online features are enabled.
  if (isChromeStorage(storage)) {
    storage.local.get(
      "onlineFeatures",
      async (onlineFeatures: Record<string, unknown>) => {
        if (onlineFeatures.onlineFeatures) {
          const response = await fetchData<ApiResponse<AffiliateLinks>>(
            Config.endpoint.affiliateLinks,
          );
          if (response) {
            storage.local.set({ affiliate: response.data });
          } else {
            console.error("Error retrieving data:", response);
          }
        }
      },
    );
  } else {
    storage.local
      .get()
      .then(async (onlineFeatures: Record<string, unknown>) => {
        if (onlineFeatures.onlineFeatures) {
          const response = await fetchData<ApiResponse<AffiliateLinks>>(
            Config.endpoint.affiliateLinks,
          );
          if (response) {
            storage.local.set({ affiliate: response.data });
          } else {
            console.error("Error retrieving data:", response);
          }
        }
      })
      .catch((error: unknown) =>
        console.error("Error retrieving data:", error),
      );
  }
}
