import type { AgentWithRaw } from 'cn-links';
import { agents, agentsWithRaw } from 'cn-links';
import React, { useEffect, useState } from 'react';

import { Config } from '../Config';
import { getStorage, isChromeStorage } from '../lib/storage';
import type { Settings } from '../models';
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
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a
          href={Config.social.homepage}
          target="_blank"
          rel="noopener norefferer"
          style={{
            padding: '0.4rem',
            borderTopLeftRadius: '9999px',
            borderTopRightRadius: '9999px',
            borderBottomLeftRadius: '9999px',
            borderBottomRightRadius: '9999px',
            fontSize: '32px',
            color: 'black',
            backgroundColor: 'rgb(55, 251, 208)',
            textDecoration: 'none',
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          JadeShip.com
        </a>
      </div>
      <h2 style={{ textAlign: 'center' }}>My Shopping Agent</h2>
      <select onChange={handleChangeMyAgent} value={settings.myAgent}>
        {[...sortedAgents, 'raw'].map((agent) => (
          <option value={agent} key={`my-agent-select-${agent}`}>
            {agent}
          </option>
        ))}
      </select>
      <a
        href={Config.social.bestAgent}
        target="_blank"
        rel="noopener norefferer"
        style={{ color: 'white' }}
      >
        the best agent for you
      </a>
      <br />
      <h2 style={{ textAlign: 'center' }}>Settings</h2>
      <p>Changes take effect after reloading</p>
      <h3>Functionality:</h3>
      <h4>Scope:</h4>
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
      />
      enable/disable all
      <br />
      <input
        type="checkbox"
        checked={settings.taobaoLink}
        onChange={() =>
          setSettings({ ...settings, taobaoLink: !settings.taobaoLink })
        }
      />
      Taobao Links
      <br />
      <input
        type="checkbox"
        checked={settings.weidianLink}
        onChange={() =>
          setSettings({ ...settings, weidianLink: !settings.weidianLink })
        }
      />
      Weidian Links
      <br />
      <input
        type="checkbox"
        checked={settings.s1688Link}
        onChange={() =>
          setSettings({ ...settings, s1688Link: !settings.s1688Link })
        }
      />
      1688 Links
      <br />
      <input
        type="checkbox"
        checked={settings.tmallLink}
        onChange={() =>
          setSettings({ ...settings, tmallLink: !settings.tmallLink })
        }
      />
      Tmall Links
      <br />
      <input
        type="checkbox"
        checked={settings.agentLink}
        onChange={() =>
          setSettings({ ...settings, agentLink: !settings.agentLink })
        }
      />
      Agent Links
      <br />
      <input
        type="checkbox"
        checked={settings.thirdPartyLink}
        onChange={() =>
          setSettings({ ...settings, thirdPartyLink: !settings.thirdPartyLink })
        }
      />
      3rd Party Link (Yupoo)
      <br />
      <h4>toolbar:</h4>
      <input
        type="checkbox"
        checked={settings.showToolbar}
        onChange={() =>
          setSettings({ ...settings, showToolbar: !settings.showToolbar })
        }
      />
      show toolbar
      <br />
      <input
        type="checkbox"
        checked={settings.stickyToolbar}
        onChange={() =>
          setSettings({ ...settings, stickyToolbar: !settings.stickyToolbar })
        }
      />
      sticky toolbar
      {settings.showToolbar ? (
        <>
          <h4>toolbar includes:</h4>
          {sortedAgents.map((agent) => {
            const checked = settings.agentsInToolbar.includes(agent);

            function swap() {
              const newSet = new Set(settings.agentsInToolbar);
              if (checked) {
                newSet.delete(agent);
              } else {
                newSet.add(agent);
              }
              setSettings({ ...settings, agentsInToolbar: Array.from(newSet) });
            }
            return (
              <React.Fragment key={`toolbar-includes-${agent}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={settings.myAgent === agent}
                  onChange={() => swap()}
                />
                {agent}
                <br />
              </React.Fragment>
            );
          })}
          {settings.agentsInToolbar.length > 6 ? (
            <>
              <span style={{ color: 'red' }}>
                displaying more than 6 agents in the toolbar will lead to
                glitches on weidian.
              </span>
              <br />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <h4>Online Features:</h4>
      <input
        type="checkbox"
        id="online_features"
        checked={settings.onlineFeatures}
        onChange={() =>
          setSettings({ ...settings, onlineFeatures: !settings.onlineFeatures })
        }
      />
      {Config.name} online features
      <br />
      <input
        type="checkbox"
        id="online_features_qcphotos"
        checked={settings.onlineFeaturesQcPhotos}
        onChange={() =>
          setSettings({
            ...settings,
            onlineFeaturesQcPhotos: !settings.onlineFeaturesQcPhotos,
          })
        }
      />
      findqc.com online features
      <br />
      <p>
        Online features are provided by Jadeship.com. They include the extra
        information, but are also technically necessary to convert shortened
        links. By establishing a connection you agree to our{' '}
        <a
          href={Config.legal.main.tos}
          target="_blank"
          rel="norefferer noopener nofollow"
        >
          terms and conditions
        </a>{' '}
        and
        <a href={Config.legal.main.privacy} rel="norefferer noopener nofollow">
          privacy policy
        </a>
        .
      </p>
      <p>
        By establishing a connection to qc.photos you agree to their{' '}
        <a href={Config.legal.qc.tos} rel="norefferer noopener nofollow">
          terms and conditions
        </a>{' '}
        and{' '}
        <a href={Config.legal.qc.privacy} rel="norefferer noopener nofollow">
          privacy policy
        </a>
        .
      </p>
      <h3>Layout</h3>
      <h4>Display Logo:</h4>
      <input
        type="checkbox"
        checked={settings.logoAgent}
        onChange={() =>
          setSettings({
            ...settings,
            logoAgent: !settings.logoAgent,
          })
        }
      />
      display agent logo
      <br />
      <input
        type="checkbox"
        checked={settings.logoPlatform}
        onChange={() =>
          setSettings({
            ...settings,
            logoPlatform: !settings.logoPlatform,
          })
        }
      />
      display platform logo
      <br />
      <h4>{Config.name} Online Elements:</h4>
      <input
        type="checkbox"
        checked={settings.showThumbnail}
        onChange={() =>
          setSettings({
            ...settings,
            showThumbnail: !settings.showThumbnail,
          })
        }
      />
      display thumbnail
      <br />
      <input
        type="checkbox"
        checked={settings.showPrice}
        onChange={() =>
          setSettings({
            ...settings,
            showPrice: !settings.showPrice,
          })
        }
      />
      display item price
      <br />
      <input
        type="checkbox"
        checked={settings.showAmountSold}
        onChange={() =>
          setSettings({
            ...settings,
            showAmountSold: !settings.showAmountSold,
          })
        }
      />
      display amount sold (last 30 days)
      <br />
      <br />
      <input
        type="checkbox"
        checked={settings.showPos}
        onChange={() =>
          setSettings({
            ...settings,
            showPos: !settings.showPos,
          })
        }
      />
      display ranking (last 30 days)
      <br />
      <input
        type="checkbox"
        checked={settings.showTitle}
        onChange={() =>
          setSettings({
            ...settings,
            showTitle: !settings.showTitle,
          })
        }
      />
      display title
      <br />
      <br />
      <h4>Extra options:</h4>
      <input
        type="number"
        id="title_length"
        min="0"
        value={parseInt(settings.displayTitleLength, 10)}
        onChange={(e) =>
          setSettings({
            ...settings,
            displayTitleLength: e.target.value,
          })
        }
        style={{ width: '20px', marginRight: '8px', textAlign: 'right' }}
      />
      limit title length (no limit: 0)
      <br />
      <input
        type="checkbox"
        checked={settings.displayOverwriteTitle}
        onChange={() =>
          setSettings({
            ...settings,
            displayOverwriteTitle: !settings.displayOverwriteTitle,
          })
        }
      />
      overwrite link title
      <br />
      <br />
      <h3>Affiliate Program:</h3>
      <input
        type="checkbox"
        checked={settings.affiliateProgram}
        onChange={() =>
          setSettings({
            ...settings,
            affiliateProgram: !settings.affiliateProgram,
          })
        }
      />
      affiliate program
      <br />
      <p>
        Advertisement. Our affiliate link is automatically appended to agent
        urls. This does not cost you anything. By leaving this on you support:
        free software, transparency, freedom of choice for the individual and
        competition between the agents. Feel free to opt out if you wish. Thank
        you &lt;3
      </p>
    </>
  );
};

export default Popup;
