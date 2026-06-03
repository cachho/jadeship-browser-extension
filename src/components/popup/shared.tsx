import type React from "react";

import type { Settings } from "../../models";

export type RateLimit = {
  remaining: number;
  limit: number;
};

export type UpdateSettings = (updatedSettings: Partial<Settings>) => void;

export const sectionDividerStyle = {
  height: "1px",
  backgroundColor: "rgba(255, 255, 255, 0.06)",
};

export const linkConversionOptions = [
  { key: "taobaoLink", label: "Taobao Links" },
  { key: "weidianLink", label: "Weidian Links" },
  { key: "s1688Link", label: "1688 Links" },
  { key: "tmallLink", label: "Tmall Links" },
  { key: "agentLink", label: "Agent Links" },
  { key: "thirdPartyLink", label: "Third Party Links" },
] as const;

export const displayOptions = [
  { key: "showThumbnail", label: "Show thumbnail" },
  { key: "showPrice", label: "Show price" },
  { key: "showAmountSold", label: "Show sales amount" },
  { key: "showPos", label: "Show position" },
  { key: "showTitle", label: "Show title" },
] as const;

export const GlassCard = ({
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

export const HiddenToggle = ({
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
