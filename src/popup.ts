/* eslint-disable no-inner-declarations */
import { getStorage, isChromeStorage } from './lib/storage';
import { settingNames } from './models/Settings';

// Get the storage API for the current browser
const storage = getStorage();

if (storage) {
  // Get the checkbox and select elements from the popup
  const taobaoLink = document.getElementById('taobao_link') as HTMLInputElement;
  const weidianLink = document.getElementById(
    'weidian_link'
  ) as HTMLInputElement;
  const s1688Link = document.getElementById('s1688_link') as HTMLInputElement;
  const tmallLink = document.getElementById('tmall_link') as HTMLInputElement;
  const agentLink = document.getElementById('agent_link') as HTMLInputElement;
  const thirdPartyLink = document.getElementById(
    '3rdparty_link'
  ) as HTMLInputElement;
  const logoAgent = document.getElementById('logo_agent') as HTMLInputElement;
  const logoPlatform = document.getElementById(
    'logo_platform'
  ) as HTMLInputElement;
  const myAgent = document.getElementById('my_agent') as HTMLSelectElement;
  const affiliateProgram = document.getElementById(
    'affiliate_program'
  ) as HTMLInputElement;
  const onlineFeatures = document.getElementById(
    'online_features'
  ) as HTMLInputElement;
  const onlineFeaturesQcPhotos = document.getElementById(
    'online_features_qcphotos'
  ) as HTMLInputElement;
  const masterToggle = document.getElementById(
    'master_toggle'
  ) as HTMLInputElement;
  const showThumbnail = document.getElementById(
    'show_thumbnail'
  ) as HTMLInputElement;
  const showPrice = document.getElementById('show_price') as HTMLInputElement;
  const showAmountSoldSummary = document.getElementById(
    'show_amount_sold_summary'
  ) as HTMLInputElement;
  const showAmountSold1 = document.getElementById(
    'show_amount_sold_1'
  ) as HTMLInputElement;
  const showAmountSold7 = document.getElementById(
    'show_amount_sold_7'
  ) as HTMLInputElement;
  const showAmountSold30 = document.getElementById(
    'show_amount_sold_30'
  ) as HTMLInputElement;
  const showAmountSoldAt = document.getElementById(
    'show_amount_sold_at'
  ) as HTMLInputElement;
  const showAmountSoldTimeframeLabel = document.getElementById(
    'show_amount_sold_timeframe_label'
  ) as HTMLInputElement;
  const showPos = document.getElementById('show_pos') as HTMLInputElement;
  const showTitle = document.getElementById('show_title') as HTMLInputElement;
  const displayTitleLength = document.getElementById(
    'title_length'
  ) as HTMLInputElement;
  const displayOverwriteTitle = document.getElementById(
    'overwrite_title'
  ) as HTMLInputElement;
  const showToolbar = document.getElementById(
    'show_toolbar'
  ) as HTMLInputElement;

  function setValues(data: any) {
    taobaoLink.checked = data.taobaoLink;
    weidianLink.checked = data.weidianLink;
    s1688Link.checked = data.s1688Link;
    tmallLink.checked = data.tmallLink;
    agentLink.checked = data.agentLink;
    thirdPartyLink.checked = data.thirdPartyLink;
    logoAgent.checked = data.logoAgent;
    logoPlatform.checked = data.logoPlatform;
    myAgent.value = data.myAgent;
    affiliateProgram.checked = data.affiliateProgram;
    onlineFeatures.checked = data.onlineFeatures;
    onlineFeaturesQcPhotos.checked = data.onlineFeaturesQcPhotos;
    masterToggle.checked = data.masterToggle;
    showThumbnail.checked = data.showThumbnail;
    showPrice.checked = data.showPrice;
    showAmountSoldSummary.checked = data.showAmountSoldSummary;
    showAmountSold1.checked = data.showAmountSold1;
    showAmountSold7.checked = data.showAmountSold7;
    showAmountSold30.checked = data.showAmountSold30;
    showAmountSoldAt.checked = data.showAmountSoldAt;
    showAmountSoldTimeframeLabel.checked = data.showAmountSoldTimeframeLabel;
    showPos.checked = data.showPos;
    showTitle.checked = data.showTitle;
    displayTitleLength.value = data.displayTitleLength ?? '0';
    displayOverwriteTitle.checked = data.displayOverwriteTitle;
    showToolbar.checked = data.showToolbar;
  }

  if (isChromeStorage(storage)) {
    storage.local.get(settingNames, (data) => {
      setValues(data);
    });
  } else if (storage && !isChromeStorage(storage)) {
    storage.local.get(settingNames).then((data) => {
      setValues(data);
    });
  }

  // Listen for changes to the checkboxes and select
  taobaoLink.addEventListener('change', () => {
    storage?.local.set({ taobaoLink: taobaoLink.checked });
  });
  weidianLink.addEventListener('change', () => {
    storage?.local.set({ weidianLink: weidianLink.checked });
  });
  s1688Link.addEventListener('change', () => {
    storage?.local.set({ s1688Link: s1688Link.checked });
  });
  tmallLink.addEventListener('change', () => {
    storage?.local.set({ tmallLink: tmallLink.checked });
  });
  agentLink.addEventListener('change', () => {
    storage?.local.set({ agentLink: agentLink.checked });
  });
  thirdPartyLink.addEventListener('change', () => {
    storage?.local.set({ thirdPartyLink: thirdPartyLink.checked });
  });
  logoAgent.addEventListener('change', () => {
    storage?.local.set({ logoAgent: logoAgent.checked });
  });
  logoPlatform.addEventListener('change', () => {
    storage?.local.set({ logoPlatform: logoPlatform.checked });
  });
  myAgent.addEventListener('change', () => {
    storage?.local.set({ myAgent: myAgent.value });
  });
  affiliateProgram.addEventListener('change', () => {
    storage?.local.set({ affiliateProgram: affiliateProgram.checked });
  });
  onlineFeatures.addEventListener('change', () => {
    storage?.local.set({ onlineFeatures: onlineFeatures.checked });
  });
  onlineFeaturesQcPhotos.addEventListener('change', () => {
    storage?.local.set({
      onlineFeaturesQcPhotos: onlineFeaturesQcPhotos.checked,
    });
  });
  masterToggle.addEventListener('change', () => {
    storage?.local.set({ masterToggle: masterToggle.checked });
    taobaoLink.checked = masterToggle.checked;
    weidianLink.checked = masterToggle.checked;
    s1688Link.checked = masterToggle.checked;
    tmallLink.checked = masterToggle.checked;
    agentLink.checked = masterToggle.checked;
    thirdPartyLink.checked = masterToggle.checked;
    storage?.local.set({ taobaoLink: masterToggle.checked });
    storage?.local.set({ weidianLink: masterToggle.checked });
    storage?.local.set({ s1688Link: masterToggle.checked });
    storage?.local.set({ tmallLink: masterToggle.checked });
    storage?.local.set({ agentLink: masterToggle.checked });
    storage?.local.set({ thirdPartyLink: thirdPartyLink.checked });
  });
  showThumbnail.addEventListener('change', () => {
    storage?.local.set({ showThumbnail: showThumbnail.checked });
  });
  showPrice.addEventListener('change', () => {
    storage?.local.set({ showPrice: showPrice.checked });
  });
  showAmountSoldSummary.addEventListener('change', () => {
    storage?.local.set({
      showAmountSoldSummary: showAmountSoldSummary.checked,
    });
  });
  showAmountSold1.addEventListener('change', () => {
    storage?.local.set({ showAmountSold1: showAmountSold1.checked });
  });
  showAmountSold7.addEventListener('change', () => {
    storage?.local.set({ showAmountSold7: showAmountSold7.checked });
  });
  showAmountSold30.addEventListener('change', () => {
    storage?.local.set({ showAmountSold30: showAmountSold30.checked });
  });
  showAmountSoldAt.addEventListener('change', () => {
    storage?.local.set({ showAmountSoldAt: showAmountSoldAt.checked });
  });
  showAmountSoldTimeframeLabel.addEventListener('change', () => {
    storage?.local.set({
      showAmountSoldTimeframeLabel: showAmountSoldTimeframeLabel.checked,
    });
  });
  showPos.addEventListener('change', () => {
    storage?.local.set({ showPos: showPos.checked });
  });
  showTitle.addEventListener('change', () => {
    storage?.local.set({ showTitle: showTitle.checked });
  });
  displayTitleLength.addEventListener('change', () => {
    storage?.local.set({ displayTitleLength: displayTitleLength.value });
  });
  displayOverwriteTitle.addEventListener('change', () => {
    storage?.local.set({
      displayOverwriteTitle: displayOverwriteTitle.checked,
    });
  });
  showToolbar.addEventListener('change', () => {
    storage?.local.set({
      showToolbar: showToolbar.checked,
    });
  });
}
