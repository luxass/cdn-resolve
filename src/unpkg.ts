import { parsePackage } from "./parse";

export interface UnpkgOptions {
  module?: boolean;
  meta?: boolean;
}

/**
 * Builds the URL for the specified module on unpkg.com.
 * @param {string} module - The name of the module.
 * @param {UnpkgOptions} options - configuration options.
 * @returns {URL} The URL for the module on unpkg.com.
 */
export function buildUnpkgUrl(
  module: string,
  options?: UnpkgOptions,
): URL | undefined {
  try {
    const pkg = parsePackage(module);

    const url = new URL(pkg.full, "https://unpkg.com/");

    if (options?.meta) {
      url.searchParams.set("meta", "true");
    }

    if (options?.module) {
      url.searchParams.set("module", "true");
    }

    return url;
  } catch {
    return undefined;
  }
}
