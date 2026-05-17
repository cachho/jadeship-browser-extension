/* eslint-disable no-param-reassign */

import { getConvertDecrypt } from "./lib/api/getConvertDecrypt";
import { getOnlineFeatures } from "./lib/api/getOnlineFeatures";
import { findLinksOnPage } from "./lib/findLinksOnPage";
import { findNestedLinksOnPage } from "./lib/findNestedLinksOnPage";
import { getTargetHrefs } from "./lib/getTargetHrefs";
import { getThirdPartyPage } from "./lib/getThirdPartyPage";
import { addHtmlOnlineElements } from "./lib/html/addHtmlOnlineElements";
import { addQcElement } from "./lib/html/addQcElement";
import { getImageAgent } from "./lib/html/getImageAgent";
import { getPlatformImage } from "./lib/html/getPlatformImage";
import { replaceTextContent } from "./lib/html/replaceTextContent";
import { initializeExtension } from "./lib/initializeExtension";
import { isBrokenRedditImageLink } from "./lib/isBrokenRedditImageLink";
import { loadSettings } from "./lib/loadSettings";
import { getStorage } from "./lib/storage";
import type { AgentWithRaw } from "./models";
import type { Settings } from "./models/Settings";
import { settingNames } from "./models/Settings";

async function main(settings: Settings) {
  // console.log("🚀🚀🚀🚀 Content Script Running 🚀🚀🚀🚀");
  // Get the selected agent from local storage
  const selectedAgent: AgentWithRaw = settings.myAgent;

  const currentUrl = new URL(window.location.href);

  // Excluded pages
  if (
    currentUrl.hostname === "www.reddit.com" &&
    currentUrl.pathname.startsWith("/r/") &&
    currentUrl.pathname.includes("/about/") &&
    ["modqueue", "reports", "spam", "edited", "unmoderated"].some((path) =>
      currentUrl.pathname.endsWith(`/${path}`)
    )
  ) {
    return;
  }

  const thirdPartyPage = getThirdPartyPage(currentUrl);
  if (!settings.thirdPartyLink && thirdPartyPage) {
    // It's a third party link while those are not allowed.
    return;
  }

  const targetedHrefs = getTargetHrefs(settings);
  // Nested links are scanned first. Then a dataset tag is added so they are not rescanned.
  const nestedLinks = thirdPartyPage ? findNestedLinksOnPage() : [];
  // Find all the links on the page with "taobao.com" in the href attribute
  const links = findLinksOnPage(targetedHrefs);

  [...links, ...nestedLinks].forEach(async (elem) => {
    // This makes sure each link is only handled once.
    // TODO: Verify that this is the best way to deal with this.
    elem.dataset.CnLinkExtension = "true";

    const originalLink = new URL(elem.href);

    if (!originalLink) {
      console.error(
        "RA Browser Extension:",
        "No link object could be extracted from link: ",
        elem.href
      );
      return false;
    }

    // Update html element
    elem.href = originalLink.href;

    const converted = await getConvertDecrypt(
      originalLink.href,
      settings.agentsInToolbar
    );

    if (!converted) {
      console.error(
        "JadeShip Browser Extension:",
        "Could not process link:",
        originalLink.href
      );
      return false;
    }

    const link = converted.cnLink;
    const newHref =
      selectedAgent === "raw"
        ? originalLink.href
        : converted.data.find((item) => item.target === selectedAgent)?.url;

    if (!newHref) {
      return false;
    }

    // ^^ Link build finished ^^

    // Add Images
    // Note: If raw images is selected, it defaults to platform images
    if (settings.logoPlatform) {
      elem.insertAdjacentHTML(
        "beforebegin",
        getPlatformImage(link.marketplace)
      );
    }
    if (settings.logoAgent && selectedAgent !== "raw") {
      elem.insertAdjacentHTML("beforebegin", getImageAgent(selectedAgent));
    }

    if (newHref) {
      elem.href = newHref;
      // Test: if the complete mark can be added here

      // Add details
      const { promiseDetails, promiseQcAvailable } = getOnlineFeatures(
        settings,
        link
      );
      if (
        settings.onlineFeatures &&
        !isBrokenRedditImageLink(elem.textContent ?? "", link.marketplace)
      ) {
        try {
          const details = await promiseDetails;
          if (details?.data) {
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
        elem.textContent?.startsWith("https://") ||
        isBrokenRedditImageLink(elem.textContent ?? "", link.marketplace)
      ) {
        elem.textContent = `${selectedAgent} link`;
      }

      // Add Qc Availability
      try {
        if (settings.onlineFeaturesQcPhotos) {
          const response = await promiseQcAvailable;
          if (response && response.count > 0) {
            addQcElement(response.fullPageUrl, elem);
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
      if (settings && Object.keys(settings).length > 0) {
        main(settings as Settings);
      } else {
        console.error("RA Browser Extension:", "No settings found");
        const storage = getStorage();
        console.error("storage", JSON.stringify(storage));
        initializeExtension(storage)
          .then(() => {
            console.log("RA Browser Extension:", "Initialized extension");
          })
          .finally(() => {
            console.log("RA Browser Extension:", "Reloading settings");
            loadSettings(settingNames).then((s) => {
              if (s && Object.keys(s).length > 0) {
                main(s as Settings);
              }
            });
          })
          .catch((error) => {
            console.error(
              "RA Browser Extension:",
              "Error initializing extension",
              error
            );
          });
      }
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
