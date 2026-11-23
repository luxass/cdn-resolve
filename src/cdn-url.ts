import { parsePackage } from "./parse";

export const CDN_BASE_URLS = {
  esm: "https://esm.sh",
  unpkg: "https://unpkg.com",
  jsdelivr: "https://cdn.jsdelivr.net/npm",
} as const;

/** Builds a provider URL from a package specifier with an explicit version. */
export function createCdnPackageUrl(
  cdn: keyof typeof CDN_BASE_URLS,
  specifier: string,
  prefix = "",
): URL {
  const { full } = parsePackage(specifier);
  return new URL(prefix + full, CDN_BASE_URLS[cdn] + "/");
}
