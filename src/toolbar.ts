import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

import {
  type ConvertDecryptFetchError,
  getConvertDecrypt,
} from "./lib/api/getConvertDecrypt";
import { getQc } from "./lib/api/getQc";
import { detectMarketplace } from "./lib/cn-links";
import { detectAgent } from "./lib/cn-links/detectAgent";
import { getStatsUrl } from "./lib/getStatsUrl";
import {
  addObserver,
  handleExceptionElements,
  undoExceptionElements,
} from "./lib/handleExceptionElements";
import { getImageAgent } from "./lib/html/getImageAgent";
import { isValidCnLink } from "./lib/isValidCnLink";
import { loadSettings } from "./lib/loadSettings";
import { placeToolbar } from "./lib/placeToolbar";
import type { Agent, AgentWithRaw, CnLink, Settings } from "./models";

const FLUID_SPRING = "cubic-bezier(0.25, 1, 0.3, 1)";

const bodyStyle: React.CSSProperties = {
  background: "rgba(6, 6, 9, 0.82)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "0.5px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "99px",
  width: "fit-content",
  height: "56px",
  zIndex: 2147483647,
  display: "flex",
  flexShrink: 0,
  fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  boxShadow:
    "0 0 0 1px rgba(0, 0, 0, 0.4), 0 24px 48px -12px rgba(0, 0, 0, 0.6)",
  position: "fixed",
  top: "24px",
  left: "50%",
  transform: "translateX(-50%)",
  transition: `transform 0.6s ${FLUID_SPRING}, opacity 0.6s ${FLUID_SPRING}, filter 0.6s ${FLUID_SPRING}`,
  padding: "4px",
  willChange: "transform, opacity",
};

const innerStyle: React.CSSProperties = {
  height: "100%",
  width: "100%",
  padding: "0 14px 0 16px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "14px",
  backgroundColor: "rgba(255, 255, 255, 0.015)",
  borderRadius: "99px",
  boxShadow: "inset 0 1px 0px rgba(255, 255, 255, 0.05)",
};

const closeStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.35)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "0.5px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "50%",
  cursor: "pointer",
  width: "26px",
  height: "26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "9px",
  transition: `all 0.4s ${FLUID_SPRING}`,
  flexShrink: 0,
  padding: 0,
  outline: "none",
};

const buttonBaseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  backgroundColor: "transparent",
  border: "1px solid transparent",
  borderRadius: "50%",
  transition: `all 0.5s ${FLUID_SPRING}`,
  cursor: "pointer",
  textDecoration: "none",
};

const qcButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "0 14px",
  height: "32px",
  borderRadius: "99px",
  background: "rgba(16, 185, 129, 0.12)",
  border: "0.5px solid rgba(16, 185, 129, 0.25)",
  color: "#34d399",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  textDecoration: "none",
  transition: `all 0.4s ${FLUID_SPRING}`,
  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.04)",
};

const statsButtonStyle: React.CSSProperties = {
  ...qcButtonStyle,
  background: "rgba(59, 130, 246, 0.12)",
  border: "0.5px solid rgba(59, 130, 246, 0.25)",
  color: "#93c5fd",
  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.04)",
};

const indicatorStyle: React.CSSProperties = {
  position: "fixed",
  top: "16px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "48px",
  height: "5px",
  borderRadius: "99px",
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  cursor: "pointer",
  zIndex: 2147483647,
  transition: `all 0.5s ${FLUID_SPRING}`,
};

type ToolbarRootProps = {
  settings: Settings;
  href: string;
  initialAgent: Agent | undefined;
};

function ToolbarRoot({ settings, href, initialAgent }: ToolbarRootProps) {
  const [closed, setClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cnLink, setCnLink] = useState<CnLink | null>(null);
  const [qcUrl, setQcUrl] = useState<string | null>(null);
  const [convertErrorMessage, setConvertErrorMessage] = useState<string | null>(
    null,
  );
  const [convertedLinks, setConvertedLinks] = useState<
    Partial<Record<AgentWithRaw, string>>
  >({});

  const lastScrollY = useRef(window.scrollY);
  const collapseTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = Math.abs(currentScrollY - lastScrollY.current);

          if (delta > 24 && currentScrollY > 50) {
            setIsCollapsed(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    collapseTimeout.current = setTimeout(
      () => {
        setIsCollapsed(true);
      },
      convertErrorMessage ? 900 : 1500,
    );
  };

  const sortedAgents = useMemo(() => {
    const sortKeys = (a: string, b: string) => {
      if (a === settings.myAgent) return 1;
      if (b === settings.myAgent || a === "raw") return -1;
      return 0;
    };
    return [...settings.agentsInToolbar].sort(sortKeys);
  }, [settings]);

  useEffect(() => {
    let alive = true;
    setConvertErrorMessage(null);
    const handleConvertFetchError = (error: ConvertDecryptFetchError) => {
      if (!alive) return;
      setConvertedLinks({});
      setCnLink(null);
      setQcUrl(null);
      setIsCollapsed(true);
      setConvertErrorMessage(
        `Failed to get converted links (Error ${error.status}: ${error.statusText}).`,
      );
    };
    getConvertDecrypt(href, settings.agentsInToolbar, handleConvertFetchError)
      .then((response) => {
        if (!alive || !response) return;
        setConvertErrorMessage(null);
        setCnLink(response.cnLink);
        const next: Partial<Record<AgentWithRaw, string>> = {};
        response.data.forEach(({ target, url }) => {
          next[target] = url;
        });
        setConvertedLinks(next);
      })
      .catch(() => {
        if (!alive) return;
        setConvertedLinks({});
        setCnLink(null);
        setQcUrl(null);
        setIsCollapsed(true);
        setConvertErrorMessage(
          "Failed to get converted links (Error 0: Unknown Error).",
        );
      });
    return () => {
      alive = false;
    };
  }, [href, settings.agentsInToolbar]);

  useEffect(() => {
    let alive = true;
    setQcUrl(null);
    if (!settings.onlineFeaturesQcPhotos || !isValidCnLink(cnLink)) return;
    getQc(cnLink.id, cnLink.marketplace)
      .then((response) => {
        if (!alive || !response || response.count <= 0) return;
        setQcUrl(response.fullPageUrl);
      })
      .catch(() => {})
      .finally(() => {
        alive = false;
      });
  }, [cnLink, settings.onlineFeaturesQcPhotos]);

  if (closed) return null;
  const statsUrl = getStatsUrl(cnLink);

  const currentBodyStyle: React.CSSProperties = {
    ...bodyStyle,
    transform: isCollapsed
      ? "translateX(-50%) translateY(-100px) scale(0.88)"
      : "translateX(-50%) translateY(0) scale(1)",
    opacity: isCollapsed ? 0 : 1,
    filter: isCollapsed ? "blur(8px)" : "none",
    pointerEvents: isCollapsed ? "none" : "auto",
  };

  const currentIndicatorStyle: React.CSSProperties = {
    ...indicatorStyle,
    transform: isCollapsed
      ? "translateX(-50%) translateY(0) scale(1)"
      : "translateX(-50%) translateY(-40px) scale(0.5)",
    opacity: isCollapsed ? 1 : 0,
    pointerEvents: isCollapsed ? "auto" : "none",
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("div", {
      style: currentIndicatorStyle,
      onMouseEnter: handleMouseEnter,
      title: "Reveal Toolbar Hub",
    }),

    React.createElement(
      "div",
      {
        className: "ra-ext-toolbar",
        style: currentBodyStyle,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      },
      React.createElement(
        "div",
        { style: innerStyle },
        qcUrl
          ? React.createElement(
              "a",
              {
                href: qcUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                style: qcButtonStyle,
                onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.20)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(16, 185, 129, 0.1)";
                },
                onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.12)";
                  e.currentTarget.style.borderColor =
                    "rgba(16, 185, 129, 0.25)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(16, 185, 129, 0.04)";
                },
              },
              React.createElement(
                "span",
                { style: { fontSize: "11px", marginTop: "-1px" } },
                "📷",
              ),
              "QC Photos",
            )
          : null,
        statsUrl
          ? React.createElement(
              "a",
              {
                href: statsUrl,
                id: `ra-ext-stats-link-${cnLink?.marketplace}-${cnLink?.id}`,
                target: "_blank",
                rel: "noopener noreferrer",
                style: statsButtonStyle,
                onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.background = "rgba(59, 130, 246, 0.20)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(59, 130, 246, 0.1)";
                },
                onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                  e.currentTarget.style.borderColor =
                    "rgba(59, 130, 246, 0.25)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(59, 130, 246, 0.04)";
                },
              },
              React.createElement(
                "span",
                { style: { fontSize: "11px", marginTop: "-1px" } },
                "📊",
              ),
              "Stats",
            )
          : null,

        React.createElement(
          "div",
          { style: { display: "flex", gap: "6px", alignItems: "center" } },
          convertErrorMessage
            ? React.createElement(
                "span",
                {
                  style: {
                    fontSize: "12px",
                    color: "rgba(248, 113, 113, 0.95)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    maxWidth: "360px",
                  },
                },
                convertErrorMessage,
              )
            : sortedAgents.map((agent) => {
                const hrefValue = convertedLinks[agent];
                const isMine = agent === settings.myAgent;
                const isReady = Boolean(true);

                return React.createElement("a", {
                  key: agent,
                  href: hrefValue ?? "#",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  title: isMine ? `${agent} (My Agent)` : agent,
                  onClick: (e: React.MouseEvent<HTMLElement>) => {
                    if (!hrefValue) e.preventDefault();
                  },
                  style: {
                    ...buttonBaseStyle,
                    backgroundColor: isMine
                      ? "rgba(255, 255, 255, 0.08)"
                      : "transparent",
                    borderColor: isMine
                      ? "rgba(255, 255, 255, 0.14)"
                      : "transparent",
                    borderWidth: "0.5px",
                    opacity: isReady ? 1 : 0.22,
                    pointerEvents: isReady ? "auto" : "none",
                  },
                  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.transform =
                      "scale(1.1) translateY(-1px)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.14)";
                  },
                  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = isMine
                      ? "rgba(255, 255, 255, 0.08)"
                      : "transparent";
                  },
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Necessary for rendering agent images
                  dangerouslySetInnerHTML: { __html: getImageAgent(agent) },
                });
              }),
        ),

        // Close System Utility
        React.createElement(
          "button",
          {
            type: "button",
            style: closeStyle,
            onClick: () => {
              setClosed(true);
              undoExceptionElements(initialAgent);
            },
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.transform = "rotate(90deg)";
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.35)";
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.transform = "rotate(0deg)";
            },
          },
          "✕",
        ),
      ),
    ),
  );
}

async function toolbar() {
  const settings = await loadSettings();
  if (!settings?.showToolbar) return false;

  const body = document.querySelector("body");
  if (!body) return false;

  const currentAgent = detectAgent(window.location.href);
  const currentMarketplace = detectMarketplace(new URL(window.location.href));

  handleExceptionElements(currentAgent);

  const rootElem = document.createElement("div");
  placeToolbar(settings, body, rootElem, currentAgent);

  const root = ReactDOM.createRoot(rootElem);
  root.render(
    React.createElement(ToolbarRoot, {
      settings,
      href: window.location.href,
      initialAgent: currentAgent,
    }),
  );

  const observer = addObserver(currentMarketplace);
  if (observer) {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  return true;
}

toolbar();
