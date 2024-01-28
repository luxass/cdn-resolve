import { expect, it } from "vitest";

import { buildUnpkgUrl } from "../src/unpkg";

it("resolve react", () => {
  const resolved = buildUnpkgUrl("react");

  expect(resolved?.host).toBe("unpkg.com");
  expect(resolved?.pathname).toBe("/react@latest");
});

it("resolve react@17", () => {
  const resolved = buildUnpkgUrl("react@17");
  expect(resolved?.host).toBe("unpkg.com");
  expect(resolved?.pathname).toBe("/react@17");
});

it("resolve react with meta", () => {
  const resolved = buildUnpkgUrl("react", {
    meta: true,
  });

  expect(resolved?.host).toBe("unpkg.com");
  expect(resolved?.searchParams.get("meta")).toBe("true");
});

it("resolve react with module", () => {
  const resolved = buildUnpkgUrl("react", {
    module: true,
  });

  expect(resolved?.host).toBe("unpkg.com");
  expect(resolved?.searchParams.get("module")).toBe("true");
});
