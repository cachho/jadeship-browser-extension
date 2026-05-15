/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';

import { Config } from '../Config';
import { agents, agentsWithRaw } from '../lib/cn-links';
import { getStorage, isChromeStorage } from '../lib/storage';
import type { AgentWithRaw, Settings } from '../models';
import { defaultSettings, settingNames } from '../models/Settings';

const Popup = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const storage = getStorage();
  const sortedAgents = agents.slice().sort((a, b) => a.localeCompare(b));

  function setValues(updatedSettings: Partial<Settings>) {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...updatedSettings,
      isDefault: false,
    }));
  }

  function loadFromLocalStorage() {
    if (isChromeStorage(storage)) {
      storage.local.get(settingNames, (data) => {
        setValues(data as Partial<Settings>);
      });
    } else if (storage && !isChromeStorage(storage)) {
      storage.local.get(settingNames).then((data) => {
        setValues(data as Partial<Settings>);
      });
    }
  }

  function saveToLocalStorage() {
    storage?.local.set(settings);
  }

  useEffect(() => {
    if (settings.isDefault === true) {
      loadFromLocalStorage();
      setSettings({ ...settings, isDefault: false });
    } else {
      saveToLocalStorage();
    }
  }, [settings]);

  const toggleAllAction =
    !settings.taobaoLink ||
    !settings.weidianLink ||
    !settings.s1688Link ||
    !settings.tmallLink ||
    !settings.agentLink ||
    !settings.thirdPartyLink;

  const handleChangeMyAgent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMyAgent = e.target.value as AgentWithRaw;
    if (!agentsWithRaw.includes(newMyAgent)) {
      console.error('Invalid agent');
      return;
    }
    const newAgentsInToolbar = new Set(settings.agentsInToolbar);
    if (newMyAgent !== 'raw' && !newAgentsInToolbar.has(newMyAgent)) {
      newAgentsInToolbar.add(newMyAgent);
    }
    setSettings({
      ...settings,
      myAgent: newMyAgent,
      agentsInToolbar: Array.from(newAgentsInToolbar),
    });
  };

  return (
    <div
      style={{
        width: '420px',
        minHeight: '600px',
        backgroundColor: '#0a0a0a',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '0',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '32px 24px 24px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background:
            'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            JadeShip
          </h1>
          <p
            style={{
              margin: '0',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '400',
            }}
          >
            Shopping Agent Extension
          </p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* My Shopping Agent */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            My Shopping Agent
          </h2>

          <select
            onChange={handleChangeMyAgent}
            value={settings.myAgent}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'white',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              marginBottom: '12px',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
              e.currentTarget.style.backgroundColor =
                'rgba(255, 255, 255, 0.05)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.backgroundColor =
                'rgba(255, 255, 255, 0.03)';
            }}
          >
            {[...sortedAgents, 'raw'].map((agent) => (
              <option
                value={agent}
                key={`my-agent-select-${agent}`}
                style={{ backgroundColor: '#1a1a1a' }}
              >
                {agent[0].toUpperCase() + agent.substring(1)}
              </option>
            ))}
          </select>

          <a
            href={Config.social.bestAgent}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#10b981',
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#059669')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#10b981')}
          >
            Find the best agent for you →
          </a>
        </div>

        {/* Settings */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                margin: '0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Settings
            </h2>
            <span
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              Reload required
            </span>
          </div>

          {/* Functionality Section */}
          <div style={{ marginBottom: '20px' }}>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Functionality
            </h3>

            {/* Scope */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  margin: '0 0 12px 0',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Link Types
              </h4>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={!toggleAllAction}
                  onChange={() =>
                    toggleAllAction
                      ? setSettings({
                          ...settings,
                          taobaoLink: true,
                          weidianLink: true,
                          s1688Link: true,
                          tmallLink: true,
                          agentLink: true,
                          thirdPartyLink: true,
                        })
                      : setSettings({
                          ...settings,
                          taobaoLink: false,
                          weidianLink: false,
                          s1688Link: false,
                          tmallLink: false,
                          agentLink: false,
                          thirdPartyLink: false,
                        })
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '12px',
                    accentColor: '#10b981',
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: '500' }}>
                  Enable All
                </span>
              </div>

              <div
                style={{
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  margin: '12px 0',
                }}
              ></div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                {[
                  { key: 'taobaoLink', label: 'Taobao' },
                  { key: 'weidianLink', label: 'Weidian' },
                  { key: 's1688Link', label: '1688' },
                  { key: 'tmallLink', label: 'Tmall' },
                  { key: 'agentLink', label: 'Agents' },
                  { key: 'thirdPartyLink', label: '3rd Party' },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <input
                      type="checkbox"
                      checked={settings[key as keyof Settings] as boolean}
                      onChange={() =>
                        setSettings({
                          ...settings,
                          [key]: !settings[key as keyof Settings],
                        })
                      }
                      style={{
                        width: '14px',
                        height: '14px',
                        marginRight: '8px',
                        accentColor: '#10b981',
                      }}
                    />
                    <span style={{ fontSize: '13px' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  margin: '0 0 12px 0',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Toolbar
              </h4>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.showToolbar}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      showToolbar: !settings.showToolbar,
                    })
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '12px',
                    accentColor: '#10b981',
                  }}
                />
                <span style={{ fontSize: '13px' }}>Show Toolbar</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.stickyToolbar}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      stickyToolbar: !settings.stickyToolbar,
                    })
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '12px',
                    accentColor: '#10b981',
                  }}
                />
                <span style={{ fontSize: '13px' }}>Sticky Position</span>
              </div>

              {settings.showToolbar && (
                <>
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      margin: '12px 0',
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    Include Agents:
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                      marginBottom: '8px',
                    }}
                  >
                    {sortedAgents.map((agent) => {
                      const checked = settings.agentsInToolbar.includes(agent);
                      const disabled = settings.myAgent === agent;
                      function swap() {
                        const newSet = new Set(settings.agentsInToolbar);
                        if (checked) {
                          newSet.delete(agent);
                        } else {
                          newSet.add(agent);
                        }
                        setSettings({
                          ...settings,
                          agentsInToolbar: Array.from(newSet),
                        });
                      }
                      return (
                        <div
                          key={`toolbar-includes-${agent}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 8px',
                            backgroundColor: checked
                              ? 'rgba(16, 185, 129, 0.1)'
                              : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${
                              checked
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(255, 255, 255, 0.05)'
                            }`,
                            borderRadius: '6px',
                            opacity: disabled ? 0.5 : 1,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => !disabled && swap()}
                            style={{
                              width: '12px',
                              height: '12px',
                              marginRight: '6px',
                              accentColor: '#10b981',
                            }}
                          />
                          <span style={{ fontSize: '11px', fontWeight: '500' }}>
                            {agent}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {settings.agentsInToolbar.length > 6 && (
                    <div
                      style={{
                        padding: '8px 10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '6px',
                        marginTop: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: '#f87171',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                        }}
                      >
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                          ⚠️
                        </span>
                        Too many agents may cause issues on Weidian
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Online Features */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  margin: '0 0 12px 0',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Online Features
              </h4>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.onlineFeatures}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      onlineFeatures: !settings.onlineFeatures,
                    })
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '12px',
                    accentColor: '#10b981',
                  }}
                />
                <span style={{ fontSize: '13px' }}>{Config.name} features</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.onlineFeaturesQcPhotos}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      onlineFeaturesQcPhotos: !settings.onlineFeaturesQcPhotos,
                    })
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '12px',
                    accentColor: '#10b981',
                  }}
                />
                <span style={{ fontSize: '13px' }}>QC Photos features</span>
              </div>

              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  lineHeight: '1.4',
                  color: 'rgba(147, 197, 253, 0.9)',
                }}
              >
                <p style={{ margin: '0 0 6px 0' }}>
                  Online features connect to external services. By using them
                  you agree to our{' '}
                  <a
                    href={Config.legal.main.tos}
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    style={{ color: '#93c5fd', textDecoration: 'underline' }}
                  >
                    terms
                  </a>{' '}
                  and{' '}
                  <a
                    href={Config.legal.main.privacy}
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    style={{ color: '#93c5fd', textDecoration: 'underline' }}
                  >
                    privacy policy
                  </a>
                  .
                </p>
                <p style={{ margin: '0' }}>
                  QC Photos has separate{' '}
                  <a
                    href={Config.legal.qc.tos}
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    style={{ color: '#93c5fd', textDecoration: 'underline' }}
                  >
                    terms
                  </a>{' '}
                  and{' '}
                  <a
                    href={Config.legal.qc.privacy}
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    style={{ color: '#93c5fd', textDecoration: 'underline' }}
                  >
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Display
          </h2>

          {/* Logo Settings */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '500',
                margin: '0 0 12px 0',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Logos
            </h4>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <input
                type="checkbox"
                checked={settings.logoAgent}
                onChange={() =>
                  setSettings({
                    ...settings,
                    logoAgent: !settings.logoAgent,
                  })
                }
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '12px',
                  accentColor: '#10b981',
                }}
              />
              <span style={{ fontSize: '13px' }}>Show agent logos</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.logoPlatform}
                onChange={() =>
                  setSettings({
                    ...settings,
                    logoPlatform: !settings.logoPlatform,
                  })
                }
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '12px',
                  accentColor: '#10b981',
                }}
              />
              <span style={{ fontSize: '13px' }}>Show platform logos</span>
            </div>
          </div>

          {/* Content Settings */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '500',
                margin: '0 0 12px 0',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Content Elements
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              {[
                { key: 'showThumbnail', label: 'Thumbnail' },
                { key: 'showPrice', label: 'Price' },
                { key: 'showAmountSold', label: 'Sales (30d)' },
                { key: 'showPos', label: 'Ranking (30d)' },
                { key: 'showTitle', label: 'Title' },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    checked={settings[key as keyof Settings] as boolean}
                    onChange={() =>
                      setSettings({
                        ...settings,
                        [key]: !settings[key as keyof Settings],
                      })
                    }
                    style={{
                      width: '14px',
                      height: '14px',
                      marginRight: '8px',
                      accentColor: '#10b981',
                    }}
                  />
                  <span style={{ fontSize: '12px' }}>{label}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                margin: '12px 0',
              }}
            ></div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>
                  Title Length
                </span>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    margin: '2px 0 0 0',
                  }}
                >
                  0 = no limit
                </p>
              </div>
              <input
                type="number"
                min="0"
                value={parseInt(settings.displayTitleLength, 10)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    displayTitleLength: e.target.value,
                  })
                }
                style={{
                  width: '70px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.displayOverwriteTitle}
                onChange={() =>
                  setSettings({
                    ...settings,
                    displayOverwriteTitle: !settings.displayOverwriteTitle,
                  })
                }
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '12px',
                  accentColor: '#10b981',
                }}
              />
              <span style={{ fontSize: '13px' }}>Override link titles</span>
            </div>
          </div>
        </div>

        {/* Affiliate Program */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Support
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <input
              type="checkbox"
              checked={settings.affiliateProgram}
              onChange={() =>
                setSettings({
                  ...settings,
                  affiliateProgram: !settings.affiliateProgram,
                })
              }
              style={{
                width: '16px',
                height: '16px',
                marginRight: '12px',
                accentColor: '#10b981',
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              Enable affiliate program
            </span>
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                lineHeight: '1.4',
                color: 'rgba(52, 211, 153, 0.9)',
                margin: '0',
              }}
            >
              💚 <strong>Support free software:</strong> Affiliate links are
              automatically added to agent URLs at no cost to you. This supports
              transparency, freedom of choice, and competition between agents.
              You can opt out anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
