import type { Agent } from 'cn-links';

export function validateRegisterPage(
  agent: Agent,
  location: Location | URL
): boolean {
  if (agent === 'pandabuy') {
    return location.pathname.startsWith('/login');
  }
  if (agent === 'superbuy' || agent === 'wegobuy' || agent === 'allchinabuy') {
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
    const newLocation = new URL(location.href.replace('/#/', '/'));
    return (
      newLocation.pathname.startsWith('/#/login/login') ||
      newLocation.pathname.startsWith('/login/login') ||
      newLocation.pathname.startsWith('/index/user/register')
    );
  }
  if (agent === 'hagobuy') {
    return location.pathname.startsWith('/register');
  }
  if (agent === 'kameymall') {
    return location.pathname.startsWith('/login');
  }
  if (agent === 'cnfans') {
    return location.pathname.startsWith('/register');
  }
  if (agent === 'ezbuycn') {
    return location.pathname.startsWith('/reg.aspx');
  }
  if (agent === 'hoobuy') {
    return location.pathname.startsWith('/signUp');
  }
  if (agent === 'basetao') {
    return false;
  }
  if (agent === 'mulebuy') {
    return location.pathname.startsWith('/register');
  }
  if (agent === 'eastmallbuy') {
    return location.pathname.startsWith('/index/user/register');
  }
  if (agent === 'hubbuycn') {
    return location.pathname.startsWith('/index/user/register');
  }
  return false;
}
