import type { Settings } from "../../models";
import {
  displayOptions,
  GlassCard,
  HiddenToggle,
  sectionDividerStyle,
  type UpdateSettings,
} from "./shared";

export const DisplayCard = ({
  settings,
  updateSettings,
}: {
  settings: Settings;
  updateSettings: UpdateSettings;
}) => (
  <GlassCard title="Display" delay="250ms">
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "rgba(255,255,255,0.4)",
            fontWeight: 600,
            paddingBottom: "2px",
          }}
        >
          Logos Controls
        </div>
        <HiddenToggle
          label="Show agent logo"
          checked={settings.logoAgent}
          onChange={() => updateSettings({ logoAgent: !settings.logoAgent })}
        />
        <HiddenToggle
          label="Show platform logo"
          checked={settings.logoPlatform}
          onChange={() =>
            updateSettings({ logoPlatform: !settings.logoPlatform })
          }
        />
      </div>

      <div style={sectionDividerStyle} />

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "rgba(255,255,255,0.4)",
            fontWeight: 600,
            paddingBottom: "4px",
          }}
        >
          Content Elements
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 14px",
          }}
        >
          {displayOptions.map(({ key, label }) => (
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
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={sectionDividerStyle} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            Max title length
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.4)",
              marginTop: "1px",
            }}
          >
            Set to 0 for unlimited length
          </span>
        </div>
        <input
          type="number"
          min="0"
          value={parseInt(settings.displayTitleLength, 10) || 0}
          onChange={(event) =>
            updateSettings({ displayTitleLength: event.target.value })
          }
          style={{
            width: "64px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "white",
            textAlign: "center",
            borderRadius: "6px",
            padding: "6px 8px",
            fontSize: "13px",
            outline: "none",
          }}
        />
      </div>

      <HiddenToggle
        label="Overwrite title"
        checked={settings.displayOverwriteTitle}
        onChange={() =>
          updateSettings({
            displayOverwriteTitle: !settings.displayOverwriteTitle,
          })
        }
      />
    </div>
  </GlassCard>
);
