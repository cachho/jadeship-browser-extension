/**
 * Extracts the main domain from a parsed URL.
 *
 * @param {URL} parsedUrl - The parsed URL instance.
 * @returns {string} The main domain without any subdomains.
 * If there's a single domain without a TLD (like localhost), that's returned directly.
 *
 * @example
 * const url = new URL("https://subdomain.example.com");
 * console.log(getDomain(url)); // Outputs: example.com
 */
function getDomain(parsedUrl: URL): string {
  const domainParts = parsedUrl.hostname.split('.');

  // If there are at least two parts (like example.com), take the last two. Otherwise, return the full domain (e.g., "localhost").
  if (domainParts.length > 1) {
    return domainParts.slice(-2).join('.');
  }
  return parsedUrl.hostname;
}

export { getDomain };
