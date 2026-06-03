import { Config } from "../Config";
import { GlassCard } from "./GlassCard";

export function RateReminderCard({
  onRateNow,
  onMaybeLater,
  onNotInterested,
}: {
  onRateNow: () => void;
  onMaybeLater: () => void;
  onNotInterested: () => void;
}) {
  const rateExtensionUrl =
    typeof browser !== "undefined"
      ? Config.social.rateExtensionFirefox
      : Config.social.rateExtensionChrome;

  return (
    <GlassCard title="Enjoying JadeShip?" delay="10ms" badge="Feedback">
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          style={{
            fontSize: "12px",
            lineHeight: "1.5",
            color: "rgba(255,255,255,0.82)",
          }}
        >
          If the extension has been helpful, please consider leaving a quick
          rating in your browser’s extension store.
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          <a
            href={rateExtensionUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onRateNow}
            style={{
              background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
              color: "#052e16",
              borderRadius: "8px",
              padding: "10px 8px",
              fontSize: "12px",
              fontWeight: 700,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Rate now
          </a>
          <button
            type="button"
            onClick={onMaybeLater}
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.85)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              padding: "10px 8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={onNotInterested}
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              color: "#fca5a5",
              border: "0.5px solid rgba(239,68,68,0.2)",
              borderRadius: "8px",
              padding: "10px 8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Not interested
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
