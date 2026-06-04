import { GlassCard, type RateLimit } from "./shared";

export const WeeklyLimitCard = ({
  rateLimit,
  rateLimitPercent,
  conversionStats,
}: {
  rateLimit: RateLimit | null;
  rateLimitPercent: number;
  conversionStats: {
    onPage: number;
    toolbar: number;
  };
}) => (
  <GlassCard title="Weekly Limit" delay="25ms" badge="Weekly">
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {rateLimit !== null ? (
        <>
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
        </>
      ) : (
        <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>
          Data will refresh with each API request.
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "12px",
            color: "rgba(255,255,255,0.8)",
            gap: "2px",
            padding: "8px 10px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.04)",
          }}
        >
          <span>Reddit/Yupoo</span>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>
            {conversionStats.onPage}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "12px",
            color: "rgba(255,255,255,0.8)",
            gap: "2px",
            padding: "8px 10px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.04)",
          }}
        >
          <span>Toolbar</span>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>
            {conversionStats.toolbar}
          </span>
        </div>
      </div>
    </div>
  </GlassCard>
);
