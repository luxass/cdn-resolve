import { expect, it } from "vitest";

import { buildJSDelivrUrl } from "../src/jsdelivr";

it("should build the JSDelivr URL with the given module", () => {
  const module = "lodash@4.17.21";
  const url = buildJSDelivrUrl(module);
  expect(url?.toString()).toBe("https://cdn.jsdelivr.net/npm/lodash@4.17.21");
});

it("should build the JSDelivr URL with the given scoped module", () => {
  const module = "@types/react@16.9.0";
  const url = buildJSDelivrUrl(module);
  expect(url?.toString()).toBe("https://cdn.jsdelivr.net/npm/@types/react@16.9.0");
});

it("should build the JSDelivr URL with the given module and path", () => {
  const module = "express@4.17.1/router/index.js";
  const url = buildJSDelivrUrl(module);
  expect(url?.toString()).toBe("https://cdn.jsdelivr.net/npm/express@4.17.1/router/index.js");
});

it("supports the +esm endpoint for a package subpath", () => {
  expect(buildJSDelivrUrl("preact@10.26.4/hooks/+esm")?.href).toBe(
    "https://cdn.jsdelivr.net/npm/preact@10.26.4/hooks/+esm",
  );
});
