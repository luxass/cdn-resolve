import { expect, test } from "vitest";

import { resolveUnpkg } from "../src/unpkg";

test("resolve react", () => {
  const resolved = resolveUnpkg("react");

  expect(resolved.host).toBe("unpkg.com");
  expect(resolved.pathname).toBe("/react@latest");
});

test("resolve react@17", () => {
  const resolved = resolveUnpkg("react@17");
  expect(resolved.host).toBe("unpkg.com");
  expect(resolved.pathname).toBe("/react@17");
});

test("resolve react with meta", () => {
  const resolved = resolveUnpkg("react", {
    meta: true
  });

  expect(resolved.host).toBe("unpkg.com");
  expect(resolved?.searchParams.get("meta")).toBe("true");
});

test("resolve react with module", () => {
  const resolved = resolveUnpkg("react", {
    module: true
  });

  expect(resolved.host).toBe("unpkg.com");
  expect(resolved?.searchParams.get("module")).toBe("true");
});
