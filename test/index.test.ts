import { expect, it } from "vitest";

import {
  buildCDNUrl,
  buildESMUrl,
  buildJSDelivrUrl,
  buildUnpkgUrl,
  normalizeCdnUrl,
  parsePackage,
} from "../src";

it("resolve cdn from string", () => {
  expect(buildCDNUrl("esm")).toBe(buildESMUrl);
  expect(buildCDNUrl("unpkg")).toBe(buildUnpkgUrl);
  expect(buildCDNUrl("jsdelivr")).toBe(buildJSDelivrUrl);
});

it("passes options through the jsDelivr builder", () => {
  expect(buildCDNUrl("jsdelivr")("preact@10.26.4", { esm: true })?.href).toBe(
    "https://cdn.jsdelivr.net/npm/preact@10.26.4/+esm",
  );
});

it("throws for unknown provider names", () => {
  expect(() => buildCDNUrl("constructor" as never)).toThrow("Unknown CDN: constructor");
});

it.each([
  ["__proto__", "Unknown CDN: __proto__"],
  ["toString", "Unknown CDN: toString"],
  ["ESM", "Unknown CDN: ESM"],
  [1, "Unknown CDN: 1"],
  [undefined, "Unknown CDN: undefined"],
  [null, "Unknown CDN: null"],
  [Symbol("esm"), "Unknown CDN: Symbol(esm)"],
])("throws Unknown CDN for %s", (cdn, message) => {
  expect(() => buildCDNUrl(cdn as never)).toThrowError(message);
});

it("throws from the parser but returns undefined from each builder for an invalid specifier", () => {
  expect(() => parsePackage("@scope/")).toThrow("Invalid package name: @scope/");
  expect(buildESMUrl("@scope/")).toBeUndefined();
  expect(buildJSDelivrUrl("@scope/")).toBeUndefined();
  expect(buildUnpkgUrl("@scope/")).toBeUndefined();
});

it("strips every leading slash when joining a CDN base", () => {
  expect(normalizeCdnUrl("esm", "//react")).toBe("https://esm.sh/react");
  expect(normalizeCdnUrl("unpkg", "react")).toBe("https://unpkg.com/react");
  expect(normalizeCdnUrl("esm", "")).toBe("https://esm.sh/");
});

it("joins a CDN base without adding a version", () => {
  expect(normalizeCdnUrl("jsdelivr", "/preact/hooks/+esm")).toBe(
    "https://cdn.jsdelivr.net/npm/preact/hooks/+esm",
  );
});
