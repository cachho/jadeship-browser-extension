import { type Agent, agents } from 'cn-links';

import { validateRegisterPage } from '../lib/validateRegisterPage';

describe('validateRegisterPage', () => {
  test('should handle all agents', () => {
    const testLinks: { [agent in Agent]: string | null } = {
      pandabuy: 'https://www.pandabuy.com/login?id=1',
      superbuy: 'https://www.superbuy.com/en/page/login/?type=register',
      wegobuy: 'https://login.wegobuy.com/en/page/login/?&type=register',
      cssbuy: 'https://m.cssbuy.com/?go=user&action=register',
      sugargoo: 'https://www.sugargoo.com/#/login/login?redirect=/home/home',
      hagobuy: 'https://www.hagobuy.com/register',
      hegobuy: 'https://www.hegobuy.com/register',
      ezbuycn: 'https://ezbuycn.com/reg.aspx',
      cnfans: 'https://cnfans.com/register/',
      kameymall: 'https://www.kameymall.com/login?loginType=1',
      hoobuy: 'https://hoobuy.com/signUp',
      allchinabuy:
        'https://www.allchinabuy.com/en/page/login/?ref=https%3A%2F%2Fwww.allchinabuy.com%2Fen%2F&type=register',
      basetao: null,
      mulebuy: 'https://mulebuy.com/register/',
      eastmallbuy: 'https://eastmallbuy.com/index/user/register.html',
      hubbuycn: 'https://hubbuycn.com/index/user/register.html',
      joyabuy: 'https://joyabuy.com/register/',
      joyagoo: 'https://joyagoo.com/register/',
      orientdig: 'https://orientdig.com/register/',
      oopbuy: 'https://www.oopbuy.com/register',
      lovegobuy: 'https://www.lovegobuy.com/login/signup',
      blikbuy: 'https://blikbuy.com/?go=user&action=register',
      ponybuy: 'https://www.ponybuy.com/en-gb/register',
      panglobalbuy: 'https://panglobalbuy.com/#/register',
      sifubuy: 'https://sifubuy.com/login?type=register',
      loongbuy: 'https://loongbuy.com/register',
      kakobuy: 'https://www.kakobuy.com/register',
      acbuy: 'https://acbuy.com/login?loginStatus=register',
    };

    agents.forEach((agent) => {
      const link = testLinks[agent];
      if (!link) {
        // Skip agents that specifically have a null value for link
        return;
      }
      const url = new URL(link);
      const valid = validateRegisterPage(agent, url!);
      if (!valid) {
        throw new Error(`Detected as false: ${agent}`);
      }
      expect(valid).toBe(true);
    });
  });
});
