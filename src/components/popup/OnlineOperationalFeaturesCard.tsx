import { Config } from "../../Config";
import type { Settings } from "../../models";
import { GlassCard, HiddenToggle, type UpdateSettings } from "./shared";

export const OnlineOperationalFeaturesCard = ({
  settings,
  updateSettings,
}: {
  settings: Settings;
  updateSettings: UpdateSettings;
}) => (
  <GlassCard title="Online Operational Features" delay="200ms">
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <HiddenToggle
        label="Enable QC Photos"
        description="Fetch quality check data dynamically"
        checked={settings.onlineFeaturesQcPhotos}
        onChange={() =>
          updateSettings({
            onlineFeaturesQcPhotos: !settings.onlineFeaturesQcPhotos,
          })
        }
      />
      <HiddenToggle
        label="Online Features"
        checked={settings.onlineFeatures}
        onChange={() =>
          updateSettings({ onlineFeatures: !settings.onlineFeatures })
        }
      />

      <div
        style={{
          padding: "10px 12px",
          backgroundColor: "rgba(59, 130, 246, 0.06)",
          border: "0.5px solid rgba(59, 130, 246, 0.15)",
          borderRadius: "8px",
          fontSize: "11px",
          lineHeight: "1.4",
          color: "rgba(147, 197, 253, 0.85)",
        }}
      >
        <p style={{ margin: "0 0 4px 0" }}>
          Online and QC features are powered by {Config.name} and partners. By
          enabling you agree to the{" "}
          <a
            href={Config.legal.main.tos}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#60a5fa", textDecoration: "none" }}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href={Config.legal.main.privacy}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#60a5fa", textDecoration: "none" }}
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  </GlassCard>
);
