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

export function resolveCDN(cdn: "skypack" | "esm" | "unpkg" | "jsdelivr") {
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
