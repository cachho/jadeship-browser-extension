import type { Agent } from 'cn-links';

export function validateRegisterPage(
  agent: Agent,
  location: Location | URL
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
    return (
      location.pathname.startsWith('/#/login/login') ||
      location.pathname.startsWith('/login/login') ||
      location.pathname.startsWith('/index/user/register')
    );
  }
  if (agent === 'hagobuy') {
    return location.pathname.startsWith('/register');
  }
  return false;
}
