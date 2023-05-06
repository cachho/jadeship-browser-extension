/* eslint-disable no-param-reassign */

import { getOnlineFeatures } from './lib/api/getOnlineFeatures';
import { buildLink } from './lib/buildLink';
import { detectPlatform } from './lib/detectPlatform';
import { extractId } from './lib/extractId';
import { findLinksOnPage } from './lib/findLinksOnPage';
import { generateProperLink } from './lib/generateProperLink';
import { getLink } from './lib/getLink';
import { addHtmlOnlineElements } from './lib/html/addHtmlOnlineElements';
import { addQcElement } from './lib/html/addQcElement';
import { getImageAgent } from './lib/html/getImageAgent';
import { getPlatformImage } from './lib/html/getPlatformImage';
import { replaceTextContent } from './lib/html/replaceTextContent';
import { isBrokenRedditImageLink } from './lib/isBrokenRedditImageLink';
import { loadSettings } from './lib/loadSettings';
import type { AgentWithRaw } from './models';
import type { Settings } from './models/Settings';
import { settingNames } from './models/Settings';

async function main(settings: Settings) {
  // console.log("🚀🚀🚀🚀 Content Script Running 🚀🚀🚀🚀");
  // Get the selected agent from local storage
  const selectedAgent: AgentWithRaw = settings.myAgent;
  // Find all the links on the page with "taobao.com" in the href attribute
  const links = findLinksOnPage(settings);

  links.forEach(async (elem) => {
    // This makes sure each link is only handled once.
    // TODO: Verify that this is the best way to deal with this.
    elem.dataset.reparchiveExtension = 'true';

    // Test if it is an agent link. If so, extract the inner link
    // Convert anchor tag to URL object.
    // Link is the URL object, elem is the html element (including the link)
    const link = await getLink(elem, settings);

    if (!link) {
      console.error('No link object could be extracted from link: ', elem.href);
      return false;
    }

    // Update html element
    elem.href = link.href;

    // At this point we have an URL object that contains the marketplace link

    const platform = detectPlatform(link.hostname);
    if (!platform) {
      console.error('No platform detected in link: ', link.href);
      return false;
    }
    const id = extractId(platform, link.href);
    if (!id) {
      console.error('No id could be extracted from link: ', link.href);
      return false;
    }
    const innerLink = generateProperLink(platform, id);

    const newLink = buildLink(selectedAgent, innerLink, platform, id, settings);

    // ^^ Link build finished ^^

    // Add Images
    // Note: If raw images is selected, it defaults to platform images
    if (settings.logoPlatform) {
      elem.insertAdjacentHTML('beforebegin', getPlatformImage(platform));
    }
    if (settings.logoAgent && selectedAgent !== 'raw') {
      elem.insertAdjacentHTML('beforebegin', getImageAgent(selectedAgent));
    }

    if (newLink) {
      elem.href = newLink;
      // Test: if the complete mark can be added here

      // Add details
      const { promiseDetails, promiseQcAvailable } = getOnlineFeatures(
        settings,
        platform,
        id
      );
      if (
        settings.onlineFeatures &&
        !isBrokenRedditImageLink(elem.textContent ?? '', platform)
      ) {
        try {
          const details = await promiseDetails;
          if (details && details.data) {
            addHtmlOnlineElements(settings, details.data, elem, platform);
            elem.title = details.data.item.goodsTitle;
          }
          elem.textContent = replaceTextContent(
            settings,
            elem,
            details,
            selectedAgent,
            platform
          );
        } catch (detailsError) {
          console.error(detailsError);
          elem.textContent = replaceTextContent(
            settings,
            elem,
            null,
            selectedAgent,
            platform
          );
        }
      } else if (
        (elem.textContent && elem.textContent.startsWith('https://')) ||
        isBrokenRedditImageLink(elem.textContent ?? '', platform)
      ) {
        elem.textContent = `${selectedAgent} link`;
      }

      // Add Qc Availability
      try {
        if (settings.onlineFeaturesQcPhotos) {
          const qcAvailable = await promiseQcAvailable;
          if (qcAvailable && qcAvailable.state === 0 && qcAvailable.data) {
            addQcElement(qcAvailable, elem);
          }
        }
      } catch (qcAvailableError) {
        console.error(qcAvailableError);
      }
    }
    return true;
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((_mutation) => {
    loadSettings(settingNames).then((settings) => {
      main(settings as Settings);
    });
  });
});

const options = {
  childList: true,
  attributes: false,
  characterData: true,
  subtree: true,
  characterDataOldValue: false,
};

observer.observe(document.body, options);
// Run once when the loading is complete
window.onload = () => {
  loadSettings(settingNames).then((settings) => {
    if (settings) {
      main(settings as Settings);
    }
  });
};
