/**
 * @internal
 * Extracts the domain from the provided hostname.
 *
 * @param {string} hostname - The hostname from which to extract the domain.
 * @returns {string} The extracted domain.
 */
export function getDomainFromHostname(hostname: string): string {
  const parts = hostname.split('.');
  const domain = parts.slice(-2).join('.');
  return domain;
}
