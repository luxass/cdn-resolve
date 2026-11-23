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

/** Base URLs for the supported npm CDNs. */
export const CDN_URLS = { ...CDN_BASE_URLS } as const;

export type SupportedCDNS = keyof typeof CDN_URLS;

/** Joins a CDN base with a path, without parsing the package specifier. */
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

/** Returns the CDN's builder, or throws if the CDN is not supported. */
export function buildCDNUrl<TCDN extends SupportedCDNS>(cdn: TCDN): Builder<TCDN>;
export function buildCDNUrl(cdn: SupportedCDNS): Builder<SupportedCDNS> {
  if (typeof cdn !== "string" || !Object.hasOwn(cdnBuilders, cdn)) {
    throw new Error(`Unknown CDN: ${cdn}`);
  }
  return cdnBuilders[cdn];
}
