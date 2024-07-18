import { parsePackage } from "./parse";

/**
 * Builds a JSDelivr URL for the specified module.
 * @param {string} module - The name of the module.
 * @returns {URL} The JSDelivr URL for the module.
 */
export function buildJSDelivrUrl(module: string): URL | undefined {
  try {
    const pkg = parsePackage(module);
    return new URL(pkg.full, "https://cdn.jsdelivr.net/npm/");
  } catch {
    return undefined;
  }
}
