import type { Platform } from '../models';
import { getDomainFromHostname } from './getDomainFromHostname';

export function detectPlatform(hostname: string): Platform | null {
  const domain = getDomainFromHostname(hostname);

  if (domain === 'weidian.com') {
    return 'weidian';
  }
  if (domain === 'taobao.com') {
    return 'taobao';
  }
  if (domain === '1688.com') {
    return '1688';
  }
  if (domain === 'tmall.com') {
    return 'tmall';
  }

  return null;
}
