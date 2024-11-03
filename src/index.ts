import type { ESMOptions } from "./esm";
import type { SkypackHeaders, SkypackOptions } from "./skypack";

import type { UnpkgOptions } from "./unpkg";

import { buildESMUrl, resolveESMTypes } from "./esm";
import { buildJSDelivrUrl } from "./jsdelivr";

import { buildSkypackUrl, resolveSkypackHeaders } from "./skypack";
import { buildUnpkgUrl } from "./unpkg";

export {
  buildESMUrl,
  buildJSDelivrUrl,
  buildSkypackUrl,
  buildUnpkgUrl,
  resolveESMTypes,
  resolveSkypackHeaders,
};

export type {
  ParsedPackage,
} from "./parse";
export { parsePackage } from "./parse";

export type { ESMOptions, SkypackHeaders, SkypackOptions, UnpkgOptions };

export const CDN_URLS = {
  skypack: "https://cdn.skypack.dev",
  esm: "https://esm.sh",
  unpkg: "https://unpkg.com",
  jsdelivr: "https://cdn.jsdelivr.net/npm",
} as const;

export type SupportedCDNS = "skypack" | "esm" | "unpkg" | "jsdelivr";

export function normalizeCdnUrl(cdn: SupportedCDNS, module: string): string {
  return `${CDN_URLS[cdn]}/${module.replace(/^\//, "")}`;
}

type Options<TCDN extends Exclude<SupportedCDNS, "jsdelivr">> = TCDN extends "skypack"
  ? SkypackOptions
  : TCDN extends "esm"
    ? ESMOptions
    : UnpkgOptions;

export type Builder<TCDN extends SupportedCDNS> = TCDN extends "jsdelivr"
  ? (module: string) => URL | undefined
  : (module: string, options?: Options<Exclude<TCDN, "jsdelivr">>) => URL | undefined;

export function buildCDNUrl<TCDN extends SupportedCDNS>(
  cdn: TCDN,
): Builder<TCDN> {
  switch (cdn) {
    case "skypack":
      return (buildSkypackUrl as unknown) as Builder<TCDN>;
    case "esm":
      return (buildESMUrl as unknown) as Builder<TCDN>;
    case "unpkg":
      return (buildUnpkgUrl as unknown) as Builder<TCDN>;
    case "jsdelivr":
      return (buildJSDelivrUrl as unknown) as Builder<TCDN>;
    default:
      throw new Error(`Unknown CDN: ${cdn}`);
  }
}
