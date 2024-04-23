import { getAffiliates } from './lib/getAffiliates';
import { loadSettings } from './lib/loadSettings';
import { setAffiliateLocalStorage } from './lib/setAffiliateLocalStorage';
import { settingNames } from './models/Settings';

async function main() {
  const settings = await loadSettings(settingNames);
  if (!settings?.affiliateProgram) return false;
  const affiliateLinks = await getAffiliates();
  if (!affiliateLinks) return null;

  const currentUrl = new URL(window.location.href);

  setAffiliateLocalStorage(affiliateLinks, currentUrl);
  return true;
}

main();

export {};
