import type { ESMOptions } from "./esm";

import type { UnpkgOptions } from "./unpkg";

import { buildESMUrl, resolveESMTypes } from "./esm";
import { buildJSDelivrUrl } from "./jsdelivr";

import { buildUnpkgUrl } from "./unpkg";

export {
  buildESMUrl,
  buildJSDelivrUrl,
  buildUnpkgUrl,
  resolveESMTypes,
};

export type {
  ParsedPackage,
} from "./parse";
export { parsePackage } from "./parse";

export type { ESMOptions, UnpkgOptions };

export const CDN_URLS = {
  esm: "https://esm.sh",
  unpkg: "https://unpkg.com",
  jsdelivr: "https://cdn.jsdelivr.net/npm",
} as const;

export type SupportedCDNS = "esm" | "unpkg" | "jsdelivr";

export function normalizeCdnUrl(cdn: SupportedCDNS, module: string): string {
  return `${CDN_URLS[cdn]}/${module.replace(/^\//, "")}`;
}

type Options<TCDN extends Exclude<SupportedCDNS, "jsdelivr">> = TCDN extends "esm"
  ? ESMOptions
  : UnpkgOptions;

export type Builder<TCDN extends SupportedCDNS> = TCDN extends "jsdelivr"
  ? (module: string) => URL | undefined
  : (module: string, options?: Options<Exclude<TCDN, "jsdelivr">>) => URL | undefined;

export function buildCDNUrl<TCDN extends SupportedCDNS>(
  cdn: TCDN,
): Builder<TCDN> {
  switch (cdn) {
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
