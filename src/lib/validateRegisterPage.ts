import type { Agent } from '../models/Agent';

export function validateRegisterPage(
  agent: Agent,
  location: Location
): boolean {
  if (agent === 'pandabuy') {
    return location.pathname === '/login';
  }
  if (agent === 'superbuy' || agent === 'wegobuy') {
    const params = new URLSearchParams(location.search);
    return (
      (location.pathname === '/en/page/login' ||
        location.pathname === '/cn/page/login') &&
      params.get('type') === 'register'
    );
  }
  if (agent === 'cssbuy') {
    const params = new URLSearchParams(location.search);
    return location.pathname === '/' && params.get('action') === 'register';
  }
  if (agent === 'sugargoo') {
    return location.pathname.indexOf('/index/user/register') !== -1;
  }
  return false;
}
