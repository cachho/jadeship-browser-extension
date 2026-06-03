import type { AgentWithRaw, Settings } from "../../models";
import {
  GlassCard,
  HiddenToggle,
  sectionDividerStyle,
  type UpdateSettings,
} from "./shared";

export const ToolbarConfigurationCard = ({
  settings,
  updateSettings,
  visibleToolbarAgentOptions,
  getAgentLogoSrc,
}: {
  settings: Settings;
  updateSettings: UpdateSettings;
  visibleToolbarAgentOptions: AgentWithRaw[];
  getAgentLogoSrc: (agent: AgentWithRaw) => string | undefined;
}) => (
  <GlassCard
    title="Toolbar Configuration"
    delay="150ms"
    badge="Requires Reload"
  >
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <HiddenToggle
        label="Show toolbar"
        description="Floating toolbar with all your shopping agents"
        checked={settings.showToolbar}
        onChange={() => updateSettings({ showToolbar: !settings.showToolbar })}
      />

      <HiddenToggle
        label="Sticky toolbar position"
        checked={settings.stickyToolbar}
        onChange={() =>
          updateSettings({ stickyToolbar: !settings.stickyToolbar })
        }
      />
      {settings.showToolbar && (
        <>
          <div style={{ ...sectionDividerStyle, margin: "4px 0" }} />
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.4)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            Agents in toolbar:
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
            }}
          >
            {visibleToolbarAgentOptions.map((agent) => {
              const checked = settings.agentsInToolbar.includes(agent);
              const disabled = settings.myAgent === agent;

              function swap() {
                const newSet = new Set(settings.agentsInToolbar);
                if (checked) {
                  newSet.delete(agent);
                } else {
                  newSet.add(agent);
                }
                updateSettings({ agentsInToolbar: Array.from(newSet) });
              }

              return (
                // biome-ignore lint: No need to have a keyboard action for this
                <div
                  key={`toolbar-includes-${agent}`}
                  onClick={() => !disabled && swap()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 10px",
                    backgroundColor: checked
                      ? "rgba(16, 185, 129, 0.06)"
                      : "rgba(255, 255, 255, 0.01)",
                    border: `0.5px solid ${
                      checked
                        ? "rgba(16, 185, 129, 0.25)"
                        : "rgba(255, 255, 255, 0.06)"
                    }`,
                    borderRadius: "8px",
                    opacity: disabled ? 0.4 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    readOnly
                    style={{
                      width: "12px",
                      height: "12px",
                      accentColor: "#10b981",
                      pointerEvents: "none",
                    }}
                  />
                  {agent !== "raw" && (
                    <img
                      src={getAgentLogoSrc(agent)}
                      alt={`${agent} logo`}
                      style={{
                        width: "12px",
                        height: "12px",
                        objectFit: "contain",
                        borderRadius: "3px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        padding: "1px",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: checked ? "#a7f3d0" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {agent[0].toUpperCase() + agent.substring(1)}
                  </span>
                </div>
              );
            })}
          </div>

          {settings.agentsInToolbar.length > 6 && (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                border: "0.5px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#f87171",
              }}
            >
              ⚠️ Selecting too many agents might cause visibility issues on
              smaller screens.
            </div>
          )}
        </>
      )}
    </div>
  </GlassCard>
);
