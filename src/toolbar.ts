import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { Config } from './Config';
import { getConvertDecrypt } from './lib/api/getConvertDecrypt';
import { getQc } from './lib/api/getQc';
import { detectMarketplace } from './lib/cn-links';
import { detectAgent } from './lib/cn-links/detectAgent';
import {
  addObserver,
  handleExceptionElements,
  undoExceptionElements,
} from './lib/handleExceptionElements';
import { getImageAgent } from './lib/html/getImageAgent';
import { loadSettings } from './lib/loadSettings';
import { placeToolbar } from './lib/placeToolbar';
import type { Agent, CnLink, Settings } from './models';

const bodyStyle: React.CSSProperties = {
  background: 'rgba(10, 10, 10, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  width: '30vw',
  maxWidth: '90vw',
  height: '56px',
  zIndex: 10000,
  flexShrink: 0,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  margin: '0 auto',
};

const innerStyle: React.CSSProperties = {
  height: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  whiteSpace: 'nowrap',
};

const webLinksStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
};

const linksStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  flex: 1,
  minWidth: 0,
};

const closeStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.7)',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '10px',
  cursor: 'pointer',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  flexShrink: 0,
};

const buttonBaseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 10px',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  color: 'white',
  textDecoration: 'none',
  fontSize: '12px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  minHeight: '32px',
  minWidth: '32px',
};

const webButtonBaseStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  padding: '8px 14px',
  fontSize: '14px',
  minWidth: 'auto',
};

type ToolbarRootProps = {
  settings: Settings;
  href: string;
  initialAgent: Agent | undefined;
};

function ToolbarRoot({ settings, href, initialAgent }: ToolbarRootProps) {
  const [closed, setClosed] = useState(false);
  const [cnLink, setCnLink] = useState<CnLink | null>(null);
  const [qcUrl, setQcUrl] = useState<string | null>(null);
  const [convertedLinks, setConvertedLinks] = useState<
    Partial<Record<Agent, string>>
  >({});

  const sortedAgents = useMemo(() => {
    const sortKeys = (a: string, b: string) => {
      if (a === settings.myAgent) {
        return 1;
      }
      if (b === settings.myAgent || a === 'raw') {
        return -1;
      }
      return 0;
    };

    return [...settings.agentsInToolbar].sort(sortKeys);
  }, [settings]);

  useEffect(() => {
    let alive = true;

    getConvertDecrypt(href, settings.agentsInToolbar)
      .then((response) => {
        if (!alive || !response) {
          return;
        }

        setCnLink(response.cnLink);

        const next: Partial<Record<Agent, string>> = {};
        response.data.forEach(({ target, url }) => {
          next[target] = url;
        });
        setConvertedLinks(next);
      })
      .catch(() => {
        // Keep toolbar visible even if conversion API fails.
      });

    return () => {
      alive = false;
    };
  }, [href, settings.agentsInToolbar]);

  useEffect(() => {
    let alive = true;

    if (!settings.onlineFeaturesQcPhotos || !cnLink) {
      return () => {
        alive = false;
      };
    }

    getQc(cnLink.id, cnLink.marketplace)
      .then((response) => {
        if (!alive || !response || response.count <= 0) {
          return;
        }
        setQcUrl(response.fullPageUrl);
      })
      .catch(() => {
        // QC link is optional.
      });

    return () => {
      alive = false;
    };
  }, [cnLink, settings.onlineFeaturesQcPhotos]);

  if (closed) {
    return null;
  }

  const statsUrl = cnLink
    ? `${Config.host.details}/item/${cnLink.marketplace}/${cnLink.id}`
    : null;

  return React.createElement(
    'div',
    { className: 'ra-ext-toolbar', style: bodyStyle },
    React.createElement(
      'div',
      { style: innerStyle },
      React.createElement(
        'div',
        { style: webLinksStyle },
        qcUrl
          ? React.createElement(
              'a',
              {
                href: qcUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                style: {
                  ...webButtonBaseStyle,
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                },
              },
              React.createElement(
                'span',
                { style: { marginRight: '6px' } },
                '📷'
              ),
              'QC Pics'
            )
          : null,
        statsUrl
          ? React.createElement(
              'a',
              {
                href: statsUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                style: webButtonBaseStyle,
              },
              React.createElement(
                'span',
                { style: { marginRight: '6px' } },
                '📊'
              ),
              'Stats'
            )
          : null
      ),
      React.createElement(
        'div',
        { style: linksStyle },
        ...sortedAgents.map((agent) => {
          const hrefValue = convertedLinks[agent];
          const isMine = agent === settings.myAgent;
          const isReady = Boolean(hrefValue);

          return React.createElement('a', {
            key: agent,
            href: hrefValue ?? '#',
            target: '_blank',
            rel: 'noopener noreferrer',
            title: isMine ? `${agent} (My Agent)` : agent,
            onClick: (event) => {
              if (!hrefValue) {
                event.preventDefault();
              }
            },
            style: {
              ...buttonBaseStyle,
              ...(isMine
                ? {
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                  }
                : null),
              ...(isReady
                ? null
                : {
                    pointerEvents: 'none',
                    opacity: 0.55,
                  }),
            },
            dangerouslySetInnerHTML: { __html: getImageAgent(agent) },
          });
        })
      ),
      React.createElement(
        'button',
        {
          className: 'ra-ext-close-btn',
          type: 'button',
          style: closeStyle,
          onClick: () => {
            setClosed(true);
            undoExceptionElements(initialAgent);
          },
        },
        '✕'
      )
    )
  );
}

async function toolbar() {
  const settings = await loadSettings();

  if (!settings?.showToolbar) {
    return false;
  }

  const body = document.querySelector('body');
  if (!body) {
    return false;
  }

  const currentAgent = detectAgent(window.location.href);
  const currentMarketplace = detectMarketplace(new URL(window.location.href));

  handleExceptionElements(currentAgent);

  const rootElem = document.createElement('div');
  placeToolbar(settings, body, rootElem, currentAgent);

  const root = ReactDOM.createRoot(rootElem);
  root.render(
    React.createElement(ToolbarRoot, {
      settings,
      href: window.location.href,
      initialAgent: currentAgent,
    })
  );

  const observer = addObserver(currentMarketplace);
  if (observer) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  return true;
}

toolbar();
