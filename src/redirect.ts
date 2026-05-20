import React from "react";
import ReactDOM from "react-dom/client";
import { detectAgent } from "./lib/cn-links";
import { getAffiliates } from "./lib/getAffiliates";
import { validateRegisterPage } from "./lib/validateRegisterPage";

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
        },
      },
      // Branding header
      React.createElement(
        "div",
        {
          style: {
            marginBottom: "20px",
          },
        },
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
