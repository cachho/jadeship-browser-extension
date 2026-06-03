/* eslint-disable no-return-assign */
import type React from "react";

import { Config } from "../../Config";
import type { AgentWithRaw, Settings } from "../../models";

type RateLimit = {
  remaining: number;
  limit: number;
};

type UpdateSettings = (updatedSettings: Partial<Settings>) => void;

const sectionDividerStyle = {
  height: "1px",
  backgroundColor: "rgba(255, 255, 255, 0.06)",
};

const linkConversionOptions = [
  { key: "taobaoLink", label: "Taobao Links" },
  { key: "weidianLink", label: "Weidian Links" },
  { key: "s1688Link", label: "1688 Links" },
  { key: "tmallLink", label: "Tmall Links" },
  { key: "agentLink", label: "Agent Links" },
  { key: "thirdPartyLink", label: "Third Party Links" },
] as const;

const displayOptions = [
  { key: "showThumbnail", label: "Show thumbnail" },
  { key: "showPrice", label: "Show price" },
  { key: "showAmountSold", label: "Show sales amount" },
  { key: "showPos", label: "Show position" },
  { key: "showTitle", label: "Show title" },
] as const;

const GlassCard = ({
  title,
  children,
  delay = "0ms",
  badge,
}: {
  title?: string;
  children: React.ReactNode;
  delay?: string;
  badge?: string;
}) => (
  <div
    className="glass-card-outer animate-enter"
    style={{ animationDelay: delay, marginBottom: "16px" }}
  >
    <div className="glass-card-inner">
      {title && (
        <div
          className="glass-card-eyebrow"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div className="glass-card-eyebrow-dot" />
            <h3 className="glass-card-title" style={{ margin: 0 }}>
              {title}
            </h3>
          </div>
          {badge && (
            <span
              style={{
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                padding: "2px 6px",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  </div>
);

const HiddenToggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) => (
  <label
    className="haptic-toggle"
    style={{
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? "none" : "auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      width: "100%",
      margin: "8px 0",
    }}
  >
    <div
      className="toggle-text-group"
      style={{ display: "flex", flexDirection: "column", gap: "2px" }}
    >
      <span
        className="toggle-label"
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.95)",
        }}
      >
        {label}
      </span>
      {description && (
        <span
          className="toggle-desc"
          style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.45)" }}
        >
          {description}
        </span>
      )}
    </div>
    <div
      className="toggle-switch"
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        flexShrink: 0,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <div className="toggle-track" />
      <div className="toggle-knob" />
    </div>
  </label>
);

export const WeeklyLimitCard = ({
  rateLimit,
  rateLimitPercent,
}: {
  rateLimit: RateLimit | null;
  rateLimitPercent: number;
}) => (
  <GlassCard title="Weekly Limit" delay="25ms" badge="Weekly">
    {rateLimit !== null ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <span>Remaining: {rateLimit.remaining}</span>
          <span>Limit: {rateLimit.limit}</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "10px",
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${rateLimitPercent}%`,
              height: "100%",
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #34d399 0%, #10b981 60%, #059669 100%)",
              transition: "width 220ms ease",
            }}
          />
        </div>
      </div>
    ) : (
      <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>
        Data will refresh with each API request.
      </div>
    )}
  </GlassCard>
);

export const MyAgentCard = ({
  settings,
  visibleToolbarAgentOptions,
  myAgentLogoSrc,
  getAgentLogoSrc,
  onChangeMyAgent,
}: {
  settings: Settings;
  visibleToolbarAgentOptions: AgentWithRaw[];
  myAgentLogoSrc?: string;
  getAgentLogoSrc: (agent: AgentWithRaw) => string | undefined;
  onChangeMyAgent: (newAgent: AgentWithRaw) => void;
}) => (
  <div className="my-agent-card-layer">
    <GlassCard title="My Shopping Agent" delay="50ms">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="custom-select-wrapper">
          <details className="custom-select-dropdown">
            <summary className="custom-select custom-select-summary">
              <span className="custom-select-selected">
                {myAgentLogoSrc && (
                  <img
                    src={myAgentLogoSrc}
                    alt={`${settings.myAgent} logo`}
                    className="custom-select-option-logo"
                  />
                )}
                {settings.myAgent[0].toUpperCase() +
                  settings.myAgent.substring(1)}
              </span>
              <span className="custom-select-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <title>Arrow Down</title>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="custom-select-options" role="listbox">
              {visibleToolbarAgentOptions.map((agent) => {
                const optionLogoSrc = getAgentLogoSrc(agent);
                return (
                  <button
                    key={`agent-${agent}`}
                    type="button"
                    className="custom-select-option"
                    role="option"
                    aria-selected={settings.myAgent === agent}
                    onClick={(event) => {
                      onChangeMyAgent(agent);
                      const detailsElement =
                        event.currentTarget.closest("details");
                      if (detailsElement instanceof HTMLDetailsElement) {
                        detailsElement.open = false;
                      }
                    }}
                  >
                    {optionLogoSrc && (
                      <img
                        src={optionLogoSrc}
                        alt={`${agent} logo`}
                        className="custom-select-option-logo"
                      />
                    )}
                    {agent[0].toUpperCase() + agent.substring(1)}
                  </button>
                );
              })}
            </div>
          </details>
        </div>

        <div style={{ paddingLeft: "2px" }}>
          <a
            href={Config.social.bestAgent}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#34d399",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Find the best agent for you →
          </a>
        </div>
      </div>
    </GlassCard>
  </div>
);

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
