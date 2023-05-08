import type { Agent } from '../models/Agent';

export function validateRegisterPage(
  agent: Agent,
  location: Location
): boolean {
  if (agent === 'pandabuy') {
    return location.pathname.startsWith('/login');
  }
  if (agent === 'superbuy' || agent === 'wegobuy') {
    const params = new URLSearchParams(location.search);
    return (
      (location.pathname.startsWith('/en/page/login') ||
        location.pathname.startsWith('/cn/page/login')) &&
      params.get('type') === 'register'
    );
  }
  if (agent === 'cssbuy') {
    const params = new URLSearchParams(location.search);
    return location.pathname === '/' && params.get('action') === 'register';
  }
  if (agent === 'sugargoo') {
    return location.pathname.startsWith('/index/user/register');
  }
  return false;
}
