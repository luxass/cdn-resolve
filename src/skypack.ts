import { parsePackage } from "./parse";

export interface SkypackOptions {
  min?: boolean;
  dts?: boolean;
}

/**
 * Build a Skypack URL for a given module.
 * @param {string} module - The module to resolve.
 * @param {SkypackOptions} options - configuration options.
 * @returns {URL} The build Skypack URL.
 */
export function buildSkypackUrl(
  module: string,
  options?: SkypackOptions,
): URL | undefined {
  try {
    const pkg = parsePackage(module);

    const url = new URL(pkg.full, "https://cdn.skypack.dev/");

    if (options?.dts) {
      url.searchParams.set("dts", "true");
    }

    if (options?.min) {
      url.searchParams.set("min", "true");
    }

    return url;
  } catch (err) {
    return undefined;
  }
}

export interface SkypackHeaders {
  typesUrl?: string;
  pinnedUrl?: string;
  importUrl?: string;
}

/**
 * Resolves the Skypack URL and retrieves the necessary information from the headers.
 * @param {URL | string} url - The Skypack URL to resolve.
 * @returns {SkypackHeaders} A promise that resolves to a SkypackResult object containing the resolved URLs.
 */
export async function resolveSkypackHeaders(
  url: URL | string,
): Promise<SkypackHeaders> {
  if (url instanceof URL) {
    url = url.toString();
  }

  const headers = await fetch(url).then((res) => res.headers);

  return {
    typesUrl: headers.has("x-typescript-types")
      ? `https://cdn.skypack.dev${headers.get("x-typescript-types")}`
      : undefined,
    pinnedUrl: headers.has("x-pinned-url")
      ? `https://cdn.skypack.dev${headers.get("x-pinned-url")}`
      : undefined,
    importUrl: headers.has("x-import-url")
      ? `https://cdn.skypack.dev${headers.get("x-import-url")}`
      : undefined,
  };
}
