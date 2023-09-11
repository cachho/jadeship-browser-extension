import { thirdParties } from '../models/3rdParty';
import { getDomain } from './getDomain';

const getThirdPartyPage = (link: URL) => {
  const domain = getDomain(link);
  return thirdParties.find((thirdParty) => thirdParty === domain);
};

export { getThirdPartyPage };
