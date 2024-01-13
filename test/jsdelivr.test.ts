import { expect, it } from "vitest";

import { resolveJSDelivr } from "../src/jsdelivr";

it("resolve react", () => {
  const resolved = resolveJSDelivr("react");

  expect(resolved?.host).toBe("cdn.jsdelivr.net");
  expect(resolved?.pathname).toBe("/react@latest");
});

it("resolve react@17", () => {
  const resolved = resolveJSDelivr("react@17");

  expect(resolved?.host).toBe("cdn.jsdelivr.net");
  expect(resolved?.pathname).toBe("/react@17");
});

it("resolve react with version and path", () => {
  const resolved = resolveJSDelivr("react@17/jsx-dev-runtime.js");

  expect(resolved?.host).toBe("cdn.jsdelivr.net");
  expect(resolved?.pathname).toBe("/react@17/jsx-dev-runtime.js");
});
