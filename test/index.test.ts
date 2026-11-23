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

it("throws from the parser but returns undefined from each builder for an invalid specifier", () => {
  expect(() => parsePackage("@scope/")).toThrow("Invalid package name: @scope/");
  expect(buildESMUrl("@scope/")).toBeUndefined();
  expect(buildJSDelivrUrl("@scope/")).toBeUndefined();
  expect(buildUnpkgUrl("@scope/")).toBeUndefined();
});

it("joins a CDN base without adding a version", () => {
  expect(normalizeCdnUrl("jsdelivr", "/preact/hooks/+esm")).toBe(
    "https://cdn.jsdelivr.net/npm/preact/hooks/+esm",
  );
});
