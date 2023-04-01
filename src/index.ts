import { type ESMOptions, resolveESM, resolveESMTypes } from "./esm";
import { resolveJSDelivr } from "./jsdelivr";
import {
  type SkypackHeaders,
  type SkypackOptions,
  resolveSkypack,
  resolveSkypackHeaders
} from "./skypack";
import { resolveUnpkg } from "./unpkg";

export { type ParsedPackage, parsePackage } from "./utils";
export {
  resolveESM,
  resolveESMTypes,
  resolveJSDelivr,
  resolveSkypack,
  resolveSkypackHeaders,
  resolveUnpkg
};
export type { ESMOptions, SkypackHeaders, SkypackOptions };


export const CDN_URLS = {
  skypack: "https://cdn.skypack.dev",
  esm: "https://cdn.esm.sh",
  unpkg: "https://unpkg.com",
  jsdelivr: "https://cdn.jsdelivr.net/npm"
}

export type SupportedCDNS = "skypack" | "esm" | "unpkg" | "jsdelivr";

export type ResolverFn = (module: string, options?: any) => URL | undefined;

// TODO: Type this better
export function resolveCDN(cdn: SupportedCDNS): ResolverFn {
  switch (cdn) {
    case "skypack":
      return resolveSkypack;
    case "esm":
      return resolveESM;
    case "unpkg":
      return resolveUnpkg;
    case "jsdelivr":
      return resolveJSDelivr;
    default:
      throw new Error(`Unknown CDN: ${cdn}`);
  }
}
