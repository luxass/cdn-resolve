import { createCdnPackageUrl } from "./cdn-url";

export interface UnpkgOptions {
  /**
   * Asks UNPKG for the package's `module` entry with the `?module` query.
   * UNPKG serves the published file and does not transform it.
   *
   * ```ts
   * buildUnpkgUrl("preact@10.26.4", { module: true });
   * // => https://unpkg.com/preact@10.26.4?module=true
   * ```
   */
  module?: boolean;

  /**
   * Lists the published files at this path with the `?meta` query.
   *
   * ```ts
   * buildUnpkgUrl("react@19", { meta: true });
   * // => https://unpkg.com/react@19?meta=true
   * ```
   */
  meta?: boolean;

  /**
   * Selects custom conditions from the package's `exports` field with the
   * `?conditions` query.
   *
   * ```ts
   * buildUnpkgUrl("react@19", { conditions: ["react-server"] });
   * // => https://unpkg.com/react@19?conditions=react-server
   * ```
   */
  conditions?: string[];
}

/**
 * Builds the URL for the specified module on unpkg.com.
 * @param {string} module - The name of the module.
 * @param {UnpkgOptions} options - configuration options.
 * @returns {URL | undefined} The URL for the module on unpkg.com, or undefined if the module name is invalid.
 */
export function buildUnpkgUrl(module: string, options?: UnpkgOptions): URL | undefined {
  try {
    const url = createCdnPackageUrl("unpkg", module);
    if (options?.meta) {
      url.searchParams.set("meta", "true");
    }
    if (options?.module) {
      url.searchParams.set("module", "true");
    }
    if (options?.conditions?.length) {
      url.searchParams.set("conditions", options.conditions.join(","));
    }
    return url;
  } catch {
    return undefined;
  }
}
