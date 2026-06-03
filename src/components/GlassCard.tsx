import type React from "react";

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
