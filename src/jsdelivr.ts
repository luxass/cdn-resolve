import { createCdnPackageUrl } from "./cdn-url";

/**
 * Builds a JSDelivr URL for the specified module.
 *
 * Append `/+esm` to the module to request a browser-ready ES module:
 *
 * ```ts
 * buildJSDelivrUrl("preact@10.26.4/hooks/+esm");
 * // => https://cdn.jsdelivr.net/npm/preact@10.26.4/hooks/+esm
 * ```
 *
 * @param {string} module - The name of the module.
 * @returns {URL | undefined} The JSDelivr URL for the module, or undefined if the module name is invalid.
 */
export function buildJSDelivrUrl(module: string): URL | undefined {
  try {
    return createCdnPackageUrl("jsdelivr", module);
  } catch {
    return undefined;
  }
}
