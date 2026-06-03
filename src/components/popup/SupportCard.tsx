import { Config } from "../../Config";
import type { Settings } from "../../models";
import { GlassCard, HiddenToggle, type UpdateSettings } from "./shared";

export const SupportCard = ({
  settings,
  updateSettings,
}: {
  settings: Settings;
  updateSettings: UpdateSettings;
}) => (
  <GlassCard title="Support" delay="300ms">
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {settings.rateReminder && (
        <div
          style={{
            padding: "12px",
            background:
              "linear-gradient(135deg, rgba(52, 211, 153, 0.14), rgba(16, 185, 129, 0.06))",
            border: "0.5px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              lineHeight: "1.4",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            ⭐ Enjoying Jadeship? Please rate the extension to help more
            shoppers discover it.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => updateSettings({ rateReminder: false })}
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)",
                fontSize: "12px",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Not interested
            </button>
            <a
              href={Config.social.rate}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.95)",
                color: "#052e16",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "6px",
                padding: "6px 10px",
                textDecoration: "none",
              }}
            >
              Rate extension
            </a>
          </div>
        </div>
      )}

      <HiddenToggle
        label="Enable affiliate program"
        checked={settings.affiliateProgram}
        onChange={() =>
          updateSettings({ affiliateProgram: !settings.affiliateProgram })
        }
      />

      <div
        style={{
          padding: "12px",
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          border: "0.5px solid rgba(16, 185, 129, 0.15)",
          borderRadius: "8px",
          fontSize: "12px",
          lineHeight: "1.4",
          color: "rgba(52, 211, 153, 0.9)",
        }}
      >
        💚 <strong>Support free software:</strong> When you register a new
        account with an agent, the extension may ask you if you want to do so
        with our referral code. This does not cost you, but it helps us out a
        lot. Thank you for considering it!
      </div>
    </div>
  </GlassCard>
);
