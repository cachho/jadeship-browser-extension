import type { AgentWithRaw } from 'cn-links';
import { agents, agentsWithRaw } from 'cn-links';
import React, { useEffect, useState } from 'react';

import { getStorage, isChromeStorage } from '../lib/storage';
import type { Settings } from '../models';
import { defaultSettings, settingNames } from '../models/Settings';

const Popup = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const storage = getStorage();

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
      <a
        href="https://reparchive.com/?r=extension"
        target="_blank"
        rel="noopener norefferer"
        style={{ paddingRight: '8px' }}
      >
        <img src="../public/reparchive_logo_white.png" width="232" />
      </a>
      <h2 style={{ textAlign: 'center' }}>My Shopping Agent</h2>
      <select onChange={handleChangeMyAgent} value={settings.myAgent}>
        {agentsWithRaw.map((agent) => (
          <option value={agent}>{agent}</option>
        ))}
      </select>
      <a
        href="https://reparchive.com/shipping-calculator?r=extension"
        target="_blank"
        rel="noopener norefferer"
        style={{ color: 'white' }}
      >
        the best agent for you
      </a>
      <br />
      <h2 style={{ textAlign: 'center' }}>Settings</h2>
      <p>Changes take effect after reloading</p>
      <h3>Functions:</h3>
      <h4>Scope:</h4>
      <input
        type="checkbox"
        checked={!toggleAllAction}
        onClick={() =>
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
        onClick={() =>
          setSettings({ ...settings, taobaoLink: !settings.taobaoLink })
        }
      />
      Taobao Links
      <br />
      <input
        type="checkbox"
        checked={settings.weidianLink}
        onClick={() =>
          setSettings({ ...settings, weidianLink: !settings.weidianLink })
        }
      />
      Weidian Links
      <br />
      <input
        type="checkbox"
        checked={settings.s1688Link}
        onClick={() =>
          setSettings({ ...settings, s1688Link: !settings.s1688Link })
        }
      />
      1688 Links
      <br />
      <input
        type="checkbox"
        checked={settings.tmallLink}
        onClick={() =>
          setSettings({ ...settings, tmallLink: !settings.tmallLink })
        }
      />
      Tmall Links
      <br />
      <input
        type="checkbox"
        checked={settings.agentLink}
        onClick={() =>
          setSettings({ ...settings, agentLink: !settings.agentLink })
        }
      />
      Agent Links
      <br />
      <input
        type="checkbox"
        checked={settings.thirdPartyLink}
        onClick={() =>
          setSettings({ ...settings, thirdPartyLink: !settings.thirdPartyLink })
        }
      />
      3rd Party Link (Yupoo)
      <br />
      <h4>toolbar:</h4>
      <input
        type="checkbox"
        checked={settings.showToolbar}
        onClick={() =>
          setSettings({ ...settings, showToolbar: !settings.showToolbar })
        }
      />
      show toolbar
      <h4>toolbar includes:</h4>
      {agents.map((agent) => {
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
          <>
            <input
              type="checkbox"
              checked={checked}
              disabled={settings.myAgent === agent}
              onClick={() => swap()}
            />
            {agent}
            <br />
          </>
        );
      })}
      {settings.agentsInToolbar.length > 6 ? (
        <>
          <span style={{ color: 'red' }}>
            displaying more than 6 agents in the toolbar will lead to glitches
            on weidian.
          </span>
          <br />
        </>
      ) : (
        <></>
      )}
      <h4>Online Features:</h4>
      <input
        type="checkbox"
        id="online_features"
        checked={settings.onlineFeatures}
        onClick={() =>
          setSettings({ ...settings, onlineFeatures: !settings.onlineFeatures })
        }
      />
      RepArchive online features
      <br />
      <input
        type="checkbox"
        id="online_features_qcphotos"
        checked={settings.onlineFeaturesQcPhotos}
        onClick={() =>
          setSettings({
            ...settings,
            onlineFeaturesQcPhotos: !settings.onlineFeaturesQcPhotos,
          })
        }
      />
      qc.photos online features
      <br />
      <p>
        Online features are provided by RepArchive.com. They include the extra
        information, but are also technically necessary to convert shortened
        links. By establishing a connection you agree to our
        <a
          href="https://ch-webdev.com/tos"
          target="_blank"
          rel="norefferer noopener nofollow"
        >
          terms and conditions
        </a>{' '}
        and
        <a
          href="https://ch-webdev.com/privacy"
          rel="norefferer noopener nofollow"
        >
          privacy policy
        </a>
        .
      </p>
      <p>
        By establishing a connection to qc.photos you agree to their{' '}
        <a href="https://qc.photos/tos" rel="norefferer noopener nofollow">
          terms and conditions
        </a>{' '}
        and
        <a href="https://qc.photos/privacy" rel="norefferer noopener nofollow">
          privacy policy
        </a>
        .
      </p>
      <h3>Layout</h3>
      <h4>Display Logo:</h4>
      <input
        type="checkbox"
        checked={settings.logoAgent}
        onClick={() =>
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
        onClick={() =>
          setSettings({
            ...settings,
            logoPlatform: !settings.logoPlatform,
          })
        }
      />
      display platform logo
      <br />
      <h4>RepArchive Online Elements:</h4>
      <input
        type="checkbox"
        checked={settings.showThumbnail}
        onClick={() =>
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
        onClick={() =>
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
        checked={settings.showAmountSoldSummary}
        onClick={() =>
          setSettings({
            ...settings,
            showAmountSoldSummary: !settings.showAmountSoldSummary,
          })
        }
      />
      display amount sold total summary
      <br />
      <input
        type="checkbox"
        checked={settings.showAmountSold1}
        onClick={() =>
          setSettings({
            ...settings,
            showAmountSold1: !settings.showAmountSold1,
          })
        }
      />
      display amount sold 24 hours
      <br />
      <input
        type="checkbox"
        checked={settings.showAmountSold7}
        onClick={() =>
          setSettings({
            ...settings,
            showAmountSold7: !settings.showAmountSold7,
          })
        }
      />
      display amount sold 7 days
      <br />
      <input
        type="checkbox"
        checked={settings.showAmountSold30}
        onClick={() =>
          setSettings({
            ...settings,
            showAmountSold30: !settings.showAmountSold30,
          })
        }
      />
      display amount sold 30 days
      <br />
      <input
        type="checkbox"
        checked={settings.showAmountSoldAt}
        onClick={() =>
          setSettings({
            ...settings,
            showAmountSoldAt: !settings.showAmountSoldAt,
          })
        }
      />
      display amount sold all time
      <br />
      <input
        type="checkbox"
        checked={settings.showAmountSoldTimeframeLabel}
        onClick={() =>
          setSettings({
            ...settings,
            showAmountSoldTimeframeLabel:
              !settings.showAmountSoldTimeframeLabel,
          })
        }
      />
      display amount sold timeframe label
      <br />
      <input
        type="checkbox"
        checked={settings.showPos}
        onClick={() =>
          setSettings({
            ...settings,
            showPos: !settings.showPos,
          })
        }
      />
      display 30 day position (ranking)
      <br />
      <input
        type="checkbox"
        checked={settings.showTitle}
        onClick={() =>
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
        onClick={() =>
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
        onClick={() =>
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
