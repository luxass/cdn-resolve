import { createCdnPackageUrl } from "./cdn-url";

export interface JSDelivrOptions {
  /**
   * Requests jsDelivr's browser-ready ES module build by adding `/+esm` to the
   * path. jsDelivr builds the package, or the subpath, into a module that a
   * browser can import directly.
   *
   * ```ts
   * buildJSDelivrUrl("preact@10.26.4/hooks", { esm: true });
   * // => https://cdn.jsdelivr.net/npm/preact@10.26.4/hooks/+esm
   * ```
   *
   * If the module already ends with `/+esm`, the builder does not add it again.
   */
  esm?: boolean;
}

/**
 * Builds a JSDelivr URL for the specified module.
 *
 * By default, jsDelivr serves the published file. Set `esm` to request a
 * browser-ready ES module:
 *
 * ```ts
 * buildJSDelivrUrl("preact@10.26.4/hooks", { esm: true });
 * // => https://cdn.jsdelivr.net/npm/preact@10.26.4/hooks/+esm
 * ```
 *
 * @param {string} module - The name of the module.
 * @param {JSDelivrOptions} options - configuration options.
 * @returns {URL | undefined} The JSDelivr URL for the module, or undefined if the module name is invalid.
 */
export function buildJSDelivrUrl(module: string, options?: JSDelivrOptions): URL | undefined {
  try {
    const url = createCdnPackageUrl("jsdelivr", module);
    if (options?.esm && !url.pathname.endsWith("/+esm")) {
      url.pathname = `${url.pathname.replace(/\/$/u, "")}/+esm`;
    }
    return url;
  } catch {
    return undefined;
  }
}
