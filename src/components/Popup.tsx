import { useCallback, useEffect, useState } from "react";

import { agents, agentsWithRaw } from "../lib/cn-links";
import {
  CONVERSION_STATS_STORAGE_KEY,
  getConversionStatsFromStorageValue,
} from "../lib/conversionStats";
import {
  getValidAgents,
  LEGACY_AGENTS_STORAGE_KEY,
} from "../lib/initializeExtension";
import { RATE_LIMIT_STORAGE_KEY } from "../lib/rateLimit";
import { getStorage, isChromeStorage } from "../lib/storage";
import type { Agent, AgentWithRaw, Settings } from "../models";
import { defaultSettings, settingNames } from "../models/Settings";
import {
  DisplayCard,
  MyAgentCard,
  OnlineOperationalFeaturesCard,
  SettingsCard,
  SupportCard,
  ToolbarConfigurationCard,
  WeeklyLimitCard,
} from "./popup/PopupSections";

const Popup = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [rateLimit, setRateLimit] = useState<{
    remaining: number;
    limit: number;
  } | null>(null);
  const [conversionStats, setConversionStats] = useState({
    onPage: 0,
    toolbar: 0,
  });
  const [legacyAgents, setLegacyAgents] = useState<Agent[]>([]);
  const storage = getStorage();
  const sortedAgents = agents.slice().sort((a, b) => a.localeCompare(b));
  const toolbarAgentOptions = [...sortedAgents, "raw"] as AgentWithRaw[];
  const visibleToolbarAgentOptions = settings.hideLegacyAgents
    ? toolbarAgentOptions.filter(
        (agent) =>
          agent === "raw" ||
          !legacyAgents.includes(agent) ||
          agent === settings.myAgent ||
          settings.agentsInToolbar.includes(agent),
      )
    : toolbarAgentOptions;
  const getAgentLogoSrc = useCallback(
    (agent: AgentWithRaw) =>
      agent === "raw"
        ? undefined
        : chrome.runtime.getURL(`public/agent_logos/${agent}_logo.png`),
    [],
  );
  const myAgentLogoSrc = getAgentLogoSrc(settings.myAgent);

  const updateSettings = useCallback((updatedSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...updatedSettings,
      isDefault: false,
    }));
  }, []);

  const setRateLimitFromStorageValue = useCallback((rateLimitData: unknown) => {
    const storedRateLimit = rateLimitData as
      | { remaining?: number; limit?: number }
      | undefined;
    if (
      typeof storedRateLimit?.remaining === "number" &&
      typeof storedRateLimit?.limit === "number"
    ) {
      setRateLimit({
        remaining: storedRateLimit.remaining,
        limit: storedRateLimit.limit,
      });
    } else {
      setRateLimit(null);
    }
  }, []);

  const setLegacyAgentsFromStorageValue = useCallback(
    (legacyAgentsData: unknown) => {
      setLegacyAgents(
        Array.isArray(legacyAgentsData)
          ? getValidAgents(legacyAgentsData as string[])
          : [],
      );
    },
    [],
  );

  const setConversionStatsFromStorageValue = useCallback((data: unknown) => {
    const parsed = getConversionStatsFromStorageValue(data);
    setConversionStats({
      onPage: parsed.onPage,
      toolbar: parsed.toolbar,
    });
  }, []);

  function loadFromLocalStorage() {
    if (isChromeStorage(storage)) {
      storage.local.get(
        [
          ...settingNames,
          RATE_LIMIT_STORAGE_KEY,
          LEGACY_AGENTS_STORAGE_KEY,
          CONVERSION_STATS_STORAGE_KEY,
        ],
        (data) => {
          const {
            [RATE_LIMIT_STORAGE_KEY]: rateLimitData,
            [LEGACY_AGENTS_STORAGE_KEY]: legacyAgentsData,
            [CONVERSION_STATS_STORAGE_KEY]: conversionStatsData,
            ...storedSettings
          } = data;
          setRateLimitFromStorageValue(rateLimitData);
          setLegacyAgentsFromStorageValue(legacyAgentsData);
          setConversionStatsFromStorageValue(conversionStatsData);
          updateSettings(storedSettings as Partial<Settings>);
        },
      );
    } else if (storage && !isChromeStorage(storage)) {
      storage.local
        .get([
          ...settingNames,
          RATE_LIMIT_STORAGE_KEY,
          LEGACY_AGENTS_STORAGE_KEY,
          CONVERSION_STATS_STORAGE_KEY,
        ])
        .then((data) => {
          const {
            [RATE_LIMIT_STORAGE_KEY]: rateLimitData,
            [LEGACY_AGENTS_STORAGE_KEY]: legacyAgentsData,
            [CONVERSION_STATS_STORAGE_KEY]: conversionStatsData,
            ...storedSettings
          } = data;
          setRateLimitFromStorageValue(rateLimitData);
          setLegacyAgentsFromStorageValue(legacyAgentsData);
          setConversionStatsFromStorageValue(conversionStatsData);
          updateSettings(storedSettings as Partial<Settings>);
        });
    }
  }

  function saveToLocalStorage() {
    storage?.local.set(settings);
  }

  // biome-ignore lint: Dependency list is correct
  useEffect(() => {
    if (settings.isDefault === true) {
      loadFromLocalStorage();
      setSettings((prevSettings) => ({ ...prevSettings, isDefault: false }));
    } else {
      saveToLocalStorage();
    }
  }, [settings]);

  useEffect(() => {
    if (!storage?.onChanged) {
      return;
    }
    const listener = (
      changes: Record<
        string,
        chrome.storage.StorageChange | browser.storage.StorageChange
      >,
      areaName: string,
    ) => {
      if (areaName !== "local") {
        return;
      }
      const rateLimitChange = changes[RATE_LIMIT_STORAGE_KEY];
      if (rateLimitChange) {
        setRateLimitFromStorageValue(rateLimitChange.newValue);
      }
      const legacyAgentsChange = changes[LEGACY_AGENTS_STORAGE_KEY];
      if (legacyAgentsChange) {
        setLegacyAgentsFromStorageValue(legacyAgentsChange.newValue);
      }
      const conversionStatsChange = changes[CONVERSION_STATS_STORAGE_KEY];
      if (conversionStatsChange) {
        setConversionStatsFromStorageValue(conversionStatsChange.newValue);
      }
    };
    storage.onChanged.addListener(listener as never);
    return () => storage.onChanged.removeListener(listener as never);
  }, [
    storage,
    setRateLimitFromStorageValue,
    setLegacyAgentsFromStorageValue,
    setConversionStatsFromStorageValue,
  ]);

  const toggleAllAction =
    !settings.taobaoLink ||
    !settings.weidianLink ||
    !settings.s1688Link ||
    !settings.tmallLink ||
    !settings.agentLink ||
    !settings.thirdPartyLink;
  const rateLimitPercent = rateLimit
    ? Math.max(0, Math.min(100, (rateLimit.remaining / rateLimit.limit) * 100))
    : 0;

  const handleChangeMyAgent = useCallback(
    (newMyAgent: AgentWithRaw) => {
      if (!agentsWithRaw.includes(newMyAgent)) {
        console.error("Invalid agent");
        return;
      }
      const newAgentsInToolbar = new Set(settings.agentsInToolbar);
      if (newMyAgent !== "raw" && !newAgentsInToolbar.has(newMyAgent)) {
        newAgentsInToolbar.add(newMyAgent);
      }
      updateSettings({
        myAgent: newMyAgent,
        agentsInToolbar: Array.from(newAgentsInToolbar),
      });
    },
    [settings.agentsInToolbar, updateSettings],
  );

  return (
    <div
      className="popup"
      style={{
        width: "420px",
        maxHeight: "600px",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header
        className="header animate-enter"
        style={{ animationDelay: "0ms", padding: "20px 20px 10px 20px" }}
      >
        <h1
          className="title"
          style={{
            margin: "0 0 4px 0",
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Jadeship
        </h1>
        <p
          className="subtitle"
          style={{
            margin: 0,
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            width: "fit-content",
          }}
        >
          Shopping Agent Extension
        </p>
      </header>

      <div className="content" style={{ padding: "0 20px 20px 20px" }}>
        <WeeklyLimitCard
          rateLimit={rateLimit}
          rateLimitPercent={rateLimitPercent}
          conversionStats={conversionStats}
        />

        <MyAgentCard
          settings={settings}
          visibleToolbarAgentOptions={visibleToolbarAgentOptions}
          myAgentLogoSrc={myAgentLogoSrc}
          getAgentLogoSrc={getAgentLogoSrc}
          onChangeMyAgent={handleChangeMyAgent}
        />

        <SettingsCard
          settings={settings}
          updateSettings={updateSettings}
          toggleAllAction={toggleAllAction}
        />

        <ToolbarConfigurationCard
          settings={settings}
          updateSettings={updateSettings}
          visibleToolbarAgentOptions={visibleToolbarAgentOptions}
          getAgentLogoSrc={getAgentLogoSrc}
        />

        <OnlineOperationalFeaturesCard
          settings={settings}
          updateSettings={updateSettings}
        />

        <DisplayCard settings={settings} updateSettings={updateSettings} />

        <SupportCard settings={settings} updateSettings={updateSettings} />
      </div>
    </div>
  );
};

export default Popup;
