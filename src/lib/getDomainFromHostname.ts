export function getDomainFromHostname(hostname: string): string {
  const parts = hostname.split('.');
  const domain = parts.slice(-2).join('.');
  return domain;
}
