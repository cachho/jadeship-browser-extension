import React from "react";
import ReactDOM from "react-dom/client";
import { detectAgent } from "./lib/cn-links";
import { getAffiliates } from "./lib/getAffiliates";
import { validateRegisterPage } from "./lib/validateRegisterPage";

const LOGO_DATA_URL =
  "data:image/png;base64,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";

const FLUID_SPRING = "cubic-bezier(0.25, 1, 0.3, 1)";

type RedirectPromptProps = {
  signupLink: string;
  agentName: string;
  onClose: () => void;
};

function RedirectPrompt({
  signupLink,
  agentName,
  onClose,
}: RedirectPromptProps) {
  const displayName = agentName.charAt(0).toUpperCase() + agentName.slice(1);

  return React.createElement(
    "div",
    {
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      },
    },
    React.createElement(
      "div",
      {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        style: {
          background: "rgba(10, 10, 14, 0.96)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "32px 28px 24px",
          width: "360px",
          maxWidth: "calc(100vw - 48px)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.5), 0 24px 48px -12px rgba(0,0,0,0.7)",
          color: "#fff",
          position: "relative",
        },
      },
      // Close button
      React.createElement(
        "button",
        {
          type: "button",
          onClick: onClose,
          style: {
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.06)",
            border: "0.5px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            color: "rgba(255, 255, 255, 0.5)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            transition: `all 0.3s ${FLUID_SPRING}`,
            outline: "none",
            padding: 0,
          },
          onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
            e.currentTarget.style.transform = "rotate(90deg)";
          },
          onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.transform = "rotate(0deg)";
          },
        },
        "✕",
      ),
      // Logo + branding header
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          },
        },
        React.createElement("img", {
          src: LOGO_DATA_URL,
          alt: "JadeShip logo",
          style: { width: "36px", height: "36px", borderRadius: "8px" },
        }),
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            {
              style: {
                fontSize: "17px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#fff",
              },
            },
            "JadeShip",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
              },
            },
            "Shopping Agent Extension",
          ),
        ),
      ),
      // Message
      React.createElement(
        "p",
        {
          style: {
            fontSize: "14px",
            lineHeight: "1.6",
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 20px 0",
          },
        },
        `You're registering on ${displayName}! 🎉 Would you like to support free software by signing up through our referral link? It costs you nothing extra.`,
      ),
      // Accept button
      React.createElement(
        "a",
        {
          href: signupLink,
          style: {
            display: "block",
            textAlign: "center" as const,
            padding: "12px 0",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "0.5px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "10px",
            color: "#34d399",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "-0.01em",
            marginBottom: "8px",
            transition: `all 0.3s ${FLUID_SPRING}`,
            cursor: "pointer",
          },
          onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.20)";
            e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
          },
          onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.12)";
            e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.35)";
          },
          onClick: () => {
            window.location.replace(signupLink);
          },
        },
        "💚 Yes, use our referral link",
      ),
      // Decline button
      React.createElement(
        "button",
        {
          type: "button",
          onClick: onClose,
          style: {
            display: "block",
            width: "100%",
            padding: "10px 0",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.35)",
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "center" as const,
            fontFamily: "inherit",
            transition: `color 0.3s ${FLUID_SPRING}`,
          },
          onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          },
          onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.35)";
          },
        },
        "No thanks, continue without",
      ),
      // Settings note
      React.createElement(
        "p",
        {
          style: {
            fontSize: "10px",
            color: "rgba(255,255,255,0.22)",
            margin: "12px 0 0 0",
            textAlign: "center" as const,
            lineHeight: "1.5",
          },
        },
        "These prompts can be permanently disabled in the extension settings.",
      ),
    ),
  );
}

function showRedirectPrompt(signupLink: string, agentName: string) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);

  function handleClose() {
    root.unmount();
    container.remove();
  }

  root.render(
    React.createElement(RedirectPrompt, {
      signupLink,
      agentName,
      onClose: handleClose,
    }),
  );
}

/**
 * Redirect can run as a content script or be injected through a browser api listener.
 * The first former does not work with client side navigation, which the agents use.
 */
function redirect() {
  getAffiliates()
    .then((affiliates) => {
      if (!affiliates) {
        return null;
      }

      //   window.addEventListener('DOMContentLoaded', () => {
      // Wait for the page to finish loading before redirecting.
      // NOTE: The DomContentLoaded method quit working with the new
      // manifest, so I removed it. However, I'm sure there's a reason
      // I used it in the first place

      // Agent related
      const agent = detectAgent(window.location.href);
      if (!agent) {
        return null;
      }

      const url = new URL(window.location.href);

      if (agent === "sugargoo") {
        url.hash = "";
      }

      if (!validateRegisterPage(agent, url)) {
        return null;
      }

      const affiliate = affiliates[agent];

      // Switch between agents that use url parameters and those who use url paths
      if (
        affiliate.signupLink &&
        affiliate.signupLink !== window.location.href
      ) {
        showRedirectPrompt(affiliate.signupLink, agent);
      }
      return true;
    })
    .catch((error) => {
      console.error(error);
    });
}

redirect();
