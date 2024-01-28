import { describe, expect, it } from "vitest";

import { buildSkypackUrl, resolveSkypack } from "../src/skypack";

describe("buildSkypackUrl", () => {
  it("should build the Skypack URL with the given module and version", () => {
    const module = "lodash@4.17.21";
    const url = buildSkypackUrl(module);
    expect(url.toString()).toBe("https://cdn.skypack.dev/lodash@4.17.21");
  });

  it("should include the 'dts' and 'min' query parameters if options.dts and options.min are true", () => {
    const module = "react";
    const options = { dts: true, min: true };
    const url = buildSkypackUrl(module, options);
    expect(url.searchParams.get("dts")).toBe("true");
    expect(url.searchParams.get("min")).toBe("true");
  });

  it("should not include the 'dts' and 'min' query parameters if options.dts and options.min are false", () => {
    const module = "react";
    const options = { dts: false, min: false };
    const url = buildSkypackUrl(module, options);
    expect(url.searchParams.has("dts")).toBe(false);
    expect(url.searchParams.has("min")).toBe(false);
  });

  it("should not include the 'dts' and 'min' query parameters if options are not provided", () => {
    const module = "react";
    const url = buildSkypackUrl(module);
    expect(url.searchParams.has("dts")).toBe(false);
    expect(url.searchParams.has("min")).toBe(false);
  });
});
