import type { Settings } from "../../models";
import {
  GlassCard,
  HiddenToggle,
  linkConversionOptions,
  sectionDividerStyle,
  type UpdateSettings,
} from "./shared";

export const SettingsCard = ({
  settings,
  updateSettings,
  toggleAllAction,
}: {
  settings: Settings;
  updateSettings: UpdateSettings;
  toggleAllAction: boolean;
}) => (
  <GlassCard title="Settings" delay="100ms" badge="Scope">
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <HiddenToggle
        label="Hide agents that are no longer operational"
        description="Legacy agents remain fully supported and can still process links; this only hides them from the interface."
        checked={settings.hideLegacyAgents}
        onChange={() =>
          updateSettings({ hideLegacyAgents: !settings.hideLegacyAgents })
        }
      />
      <div style={{ ...sectionDividerStyle, margin: "4px 0" }} />
      <HiddenToggle
        label="Toggle all links conversion"
        checked={!toggleAllAction}
        onChange={() =>
          updateSettings(
            toggleAllAction
              ? {
                  taobaoLink: true,
                  weidianLink: true,
                  s1688Link: true,
                  tmallLink: true,
                  agentLink: true,
                  thirdPartyLink: true,
                }
              : {
                  taobaoLink: false,
                  weidianLink: false,
                  s1688Link: false,
                  tmallLink: false,
                  agentLink: false,
                  thirdPartyLink: false,
                },
          )
        }
      />
      <p>
        This only disables the on-page conversion on reddit and yupoo. The
        toolbar is not affected.
      </p>
      <div style={{ ...sectionDividerStyle, margin: "4px 0" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 16px",
        }}
      >
        {linkConversionOptions.map(({ key, label }) => (
          <label
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={() =>
                updateSettings({ [key]: !settings[key] } as Partial<Settings>)
              }
              style={{
                accentColor: "#10b981",
                width: "14px",
                height: "14px",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  </GlassCard>
);
