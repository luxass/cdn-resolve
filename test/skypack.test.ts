import { describe, expect, it } from "vitest";

import { buildSkypackUrl, resolveSkypackHeaders } from "../src/skypack";

describe("buildSkypackUrl", () => {
  it("should build the Skypack URL with the given module and version", () => {
    const module = "lodash@4.17.21";
    const url = buildSkypackUrl(module);
    expect(url?.toString()).toBe("https://cdn.skypack.dev/lodash@4.17.21");
  });

  it("should include the 'dts' and 'min' query parameters if options.dts and options.min are true", () => {
    const module = "react";
    const options = { dts: true, min: true };
    const url = buildSkypackUrl(module, options);
    expect(url?.searchParams.get("dts")).toBe("true");
    expect(url?.searchParams.get("min")).toBe("true");
  });

  it("should not include the 'dts' and 'min' query parameters if options.dts and options.min are false", () => {
    const module = "react";
    const options = { dts: false, min: false };
    const url = buildSkypackUrl(module, options);
    expect(url?.searchParams.has("dts")).toBe(false);
    expect(url?.searchParams.has("min")).toBe(false);
  });

  it("should not include the 'dts' and 'min' query parameters if options are not provided", () => {
    const module = "react";
    const url = buildSkypackUrl(module);
    expect(url?.searchParams.has("dts")).toBe(false);
    expect(url?.searchParams.has("min")).toBe(false);
  });
});

describe("resolveSkypackHeaders", () => {
  it("should return typesUrl, pinnedUrl, and importUrl from headers when URL is a string", async () => {
    const headers = await resolveSkypackHeaders(buildSkypackUrl("react@18.2.0", {
      dts: true,
    })!.toString());

    expect(headers.typesUrl).toBe("https://cdn.skypack.dev/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mode=types/index.d.ts");
    expect(headers.pinnedUrl).toBe("https://cdn.skypack.dev/pin/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/mode=imports/optimized/react.js");
    expect(headers.importUrl).toBe("https://cdn.skypack.dev/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mode=imports/optimized/react.js");
  });

  it("should return typesUrl, pinnedUrl, and importUrl from headers when URL is a URL object", async () => {
    const headers = await resolveSkypackHeaders(buildSkypackUrl("react@18.2.0", {
      dts: true,
    })!);

    expect(headers.typesUrl).toBe("https://cdn.skypack.dev/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mode=types/index.d.ts");
    expect(headers.pinnedUrl).toBe("https://cdn.skypack.dev/pin/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/mode=imports/optimized/react.js");
    expect(headers.importUrl).toBe("https://cdn.skypack.dev/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mode=imports/optimized/react.js");
  });

  it("should return undefined for typesUrl, pinnedUrl, and importUrl when headers are not present", async () => {
    const headers = await resolveSkypackHeaders("https://cdn.skypack.dev/non-existent-module");
    expect(headers.typesUrl).toBeUndefined();
    expect(headers.pinnedUrl).toBeUndefined();
    expect(headers.importUrl).toBeUndefined();
  });
});
