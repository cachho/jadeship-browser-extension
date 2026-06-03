import { Config } from "../../Config";
import type { AgentWithRaw, Settings } from "../../models";
import { GlassCard } from "./shared";

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
