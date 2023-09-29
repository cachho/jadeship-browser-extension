import { type Agent, agents } from 'cn-links';

import { validateRegisterPage } from '../lib/validateRegisterPage';

describe('validateRegisterPage', () => {
  test('should handle all agents', () => {
    const testLinks: { [agent in Agent]: string } = {
      pandabuy: 'https://www.pandabuy.com/login?id=1',
      superbuy: 'https://www.superbuy.com/en/page/login/?type=register',
      wegobuy: 'https://login.wegobuy.com/en/page/login/?&type=register',
      cssbuy: 'https://m.cssbuy.com/?go=user&action=register',
      sugargoo: 'https://www.sugargoo.com/#/login/login?redirect=/home/home',
      hagobuy: 'https://www.hagobuy.com/register',
      ezbuycn: 'https://ezbuycn.com/reg.aspx',
      cnfans: 'https://cnfans.com/register/',
      kameymall: 'https://www.kameymall.com/login?loginType=1',
    };

    agents.forEach((agent) => {
      const link = testLinks[agent];
      const url = new URL(link);
      const valid = validateRegisterPage(agent, url!);
      if (!valid) {
        throw new Error(`Detected as false: ${agent}`);
      }
      expect(valid).toBe(true);
    });
  });
});