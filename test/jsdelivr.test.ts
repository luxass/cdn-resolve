import { expect, test } from "vitest";

import { resolveJSDelivr } from "../src/jsdelivr";

test("resolve react", () => {
  const resolved = resolveJSDelivr("react");

  expect(resolved.host).toBe("cdn.jsdelivr.net");
  expect(resolved.pathname).toBe("/react@latest");
});

test("resolve react@17", () => {
  const resolved = resolveJSDelivr("react@17");

  expect(resolved.host).toBe("cdn.jsdelivr.net");
  expect(resolved.pathname).toBe("/react@17");
});

test("resolve react with version and path", () => {
  const resolved = resolveJSDelivr("react@17/jsx-dev-runtime.js");

  expect(resolved.host).toBe("cdn.jsdelivr.net");
  expect(resolved.pathname).toBe("/react@17/jsx-dev-runtime.js");
});
