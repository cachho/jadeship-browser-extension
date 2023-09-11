/* eslint-disable no-param-reassign */

import { CnLink } from 'cn-links';

import { getOnlineFeatures } from './lib/api/getOnlineFeatures';
import { findLinksOnPage } from './lib/findLinksOnPage';
import { getDomain } from './lib/getDomain';
import { getTargetHrefs } from './lib/getTargetHrefs';
import { handleShortenedLink } from './lib/handleShortenedLink';
import { addHtmlOnlineElements } from './lib/html/addHtmlOnlineElements';
import { addQcElement } from './lib/html/addQcElement';
import { getImageAgent } from './lib/html/getImageAgent';
import { getPlatformImage } from './lib/html/getPlatformImage';
import { replaceTextContent } from './lib/html/replaceTextContent';
import { isBrokenRedditImageLink } from './lib/isBrokenRedditImageLink';
import { loadSettings } from './lib/loadSettings';
import type { AgentWithRaw } from './models';
import type { ThirdParty } from './models/3rdParty';
import { thirdParty } from './models/3rdParty';
import type { Settings } from './models/Settings';
import { settingNames } from './models/Settings';

async function main(settings: Settings) {
  // console.log("🚀🚀🚀🚀 Content Script Running 🚀🚀🚀🚀");
  // Get the selected agent from local storage
  const selectedAgent: AgentWithRaw = settings.myAgent;

  if (
    !settings.thirdPartyLink &&
    thirdParty.indexOf(
      getDomain(new URL(window.location.href)) as ThirdParty
    ) !== -1
  ) {
    // It's a third party link while those are not allowed.
    return;
  }

  // Find all the links on the page with "taobao.com" in the href attribute
  const targetedHrefs = getTargetHrefs(settings);
  const links = findLinksOnPage(targetedHrefs);

  links.forEach(async (elem) => {
    // This makes sure each link is only handled once.
    // TODO: Verify that this is the best way to deal with this.
    elem.dataset.reparchiveExtension = 'true';

    // Test if it is an agent link. If so, extract the inner link
    // Convert anchor tag to URL object.
    // Link is the URL object, elem is the html element (including the link)
    const decryptLink = async () => {
      const decrypted = await handleShortenedLink(elem, settings);
      const newLink = decrypted ?? new URL(elem.href);
      return newLink;
    };

    const originalLink = await decryptLink();

    if (!originalLink) {
      console.error(
        'RA Browser Extension:',
        'No link object could be extracted from link: ',
        elem.href
      );
      return false;
    }

    // Update html element
    elem.href = originalLink.href;

    // At this point we have an URL object that contains the marketplace link

    const getLink = () => {
      try {
        return new CnLink(originalLink);
      } catch (err) {
        return null;
      }
    };

    const link = getLink();
    if (!link) {
      console.error(
        'RA Browser Extension:',
        'Could not process link:',
        originalLink
      );
      return false;
    }
    const newLink = link.as(selectedAgent, undefined, '27');

    // ^^ Link build finished ^^

    // Add Images
    // Note: If raw images is selected, it defaults to platform images
    if (settings.logoPlatform) {
      elem.insertAdjacentHTML(
        'beforebegin',
        getPlatformImage(link.marketplace)
      );
    }
    if (settings.logoAgent && selectedAgent !== 'raw') {
      elem.insertAdjacentHTML('beforebegin', getImageAgent(selectedAgent));
    }

    if (newLink) {
      elem.href = newLink.href;
      // Test: if the complete mark can be added here

      // Add details
      const { promiseDetails, promiseQcAvailable } = getOnlineFeatures(
        settings,
        link
      );
      if (
        settings.onlineFeatures &&
        !isBrokenRedditImageLink(elem.textContent ?? '', link.marketplace)
      ) {
        try {
          const details = await promiseDetails;
          if (details && details.data) {
            addHtmlOnlineElements(
              settings,
              details.data,
              elem,
              link.marketplace
            );
            elem.title = details.data.item.goodsTitle;
          }
          elem.textContent = replaceTextContent(
            settings,
            elem,
            details,
            selectedAgent,
            link.marketplace
          );
        } catch (detailsError) {
          console.error(detailsError);
          elem.textContent = replaceTextContent(
            settings,
            elem,
            null,
            selectedAgent,
            link.marketplace
          );
        }
      } else if (
        (elem.textContent && elem.textContent.startsWith('https://')) ||
        isBrokenRedditImageLink(elem.textContent ?? '', link.marketplace)
      ) {
        elem.textContent = `${selectedAgent} link`;
      }

      // Add Qc Availability
      try {
        if (settings.onlineFeaturesQcPhotos) {
          const qcAvailable = await promiseQcAvailable;
          if (qcAvailable?.success && qcAvailable.data?.product_has_qc) {
            addQcElement(link, elem);
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
