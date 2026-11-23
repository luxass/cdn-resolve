import { parsePackage } from "./parse";

export const CDN_BASE_URLS = {
  esm: "https://esm.sh",
  unpkg: "https://unpkg.com",
  jsdelivr: "https://cdn.jsdelivr.net/npm",
} as const;

/**
 * Resolves a path against a CDN base URL.
 *
 * The path is relative, so `resolveCdnUrl("https://esm.sh", "jsr/@std/path")`
 * returns `https://esm.sh/jsr/@std/path`.
 */
export function resolveCdnUrl(baseUrl: string, path: string): URL {
  return new URL(path, `${baseUrl}/`);
}

/**
 * Builds a CDN URL from a package specifier.
 *
 * The specifier always gets an explicit version, so `react` becomes
 * `react@latest`. The optional prefix goes before the package name, for
 * example `*` for esm.sh's external dependencies.
 *
 * @throws Error if the package name is invalid.
 */
export function createCdnPackageUrl(
  cdn: keyof typeof CDN_BASE_URLS,
  specifier: string,
  prefix = "",
): URL {
  const { full } = parsePackage(specifier);
  return resolveCdnUrl(CDN_BASE_URLS[cdn], prefix + full);
}
