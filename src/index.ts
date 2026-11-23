import { CDN_BASE_URLS } from "./cdn-url";
import type { ESMOptions } from "./esm";
import { buildESMUrl, resolveESMTypes } from "./esm";
import { buildJSDelivrUrl } from "./jsdelivr";
import type { UnpkgOptions } from "./unpkg";
import { buildUnpkgUrl } from "./unpkg";

export { buildESMUrl, buildJSDelivrUrl, buildUnpkgUrl, resolveESMTypes };
export { parsePackage } from "./parse";
export type { ParsedPackage } from "./parse";
export type { ESMOptions, UnpkgOptions };

/**
 * The base URLs for the supported npm CDNs.
 *
 * Every builder resolves package paths against one of these URLs.
 */
export const CDN_URLS = { ...CDN_BASE_URLS } as const;

export type SupportedCDNS = keyof typeof CDN_URLS;

/**
 * Joins a CDN base URL with a module path.
 *
 * Unlike the builders, this function does not parse the module or add a version:
 *
 * ```ts
 * normalizeCdnUrl("jsdelivr", "/preact/hooks/+esm");
 * // => https://cdn.jsdelivr.net/npm/preact/hooks/+esm
 * ```
 */
export function normalizeCdnUrl(cdn: SupportedCDNS, module: string): string {
  return CDN_URLS[cdn] + "/" + module.replace(/^\//u, "");
}

type Options<TCDN extends Exclude<SupportedCDNS, "jsdelivr">> = TCDN extends "esm"
  ? ESMOptions
  : UnpkgOptions;

export type Builder<TCDN extends SupportedCDNS> = TCDN extends "jsdelivr"
  ? (module: string) => URL | undefined
  : (module: string, options?: Options<Exclude<TCDN, "jsdelivr">>) => URL | undefined;

const cdnBuilders = {
  esm: buildESMUrl,
  unpkg: buildUnpkgUrl,
  jsdelivr: buildJSDelivrUrl,
} satisfies { [CDN in SupportedCDNS]: Builder<CDN> };

/**
 * Returns the URL builder for a CDN.
 *
 * ```ts
 * const esm = buildCDNUrl("esm");
 * esm("react@19", { bundle: "no-bundle" });
 * // => https://esm.sh/react@19?bundle=false
 * ```
 *
 * @throws Error if the CDN is not supported.
 */
export function buildCDNUrl<TCDN extends SupportedCDNS>(cdn: TCDN): Builder<TCDN>;
export function buildCDNUrl(cdn: SupportedCDNS): Builder<SupportedCDNS> {
  if (typeof cdn !== "string" || !Object.hasOwn(cdnBuilders, cdn)) {
    throw new Error(`Unknown CDN: ${cdn}`);
  }
  return cdnBuilders[cdn];
}
