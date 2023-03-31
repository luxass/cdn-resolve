import { expect, test } from "vitest";

import { resolveESM } from "../src/esm";
import { log } from "console";

test("resolve react", () => {
  const resolved = resolveESM("react");

  expect(resolved.host).toBe("esm.sh");
  expect(resolved.pathname).toBe("/react@latest");
});

test("resolve react@17", () => {
  const resolved = resolveESM("react@17");
  expect(resolved.host).toBe("esm.sh");
  expect(resolved.pathname).toBe("/react@17");
});

test("resolve react with preact alias", () => {
  const resolved = resolveESM("react", {
    alias: {
      react: "preact/compat"
    }
  });

  expect(resolved.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("alias")).toBe("react:preact/compat");
});

test("resolve react with preact alias and deps", () => {
  const resolved = resolveESM("react", {
    alias: {
      react: "preact/compat"
    },
    deps: ["preact@10.5.14"]
  });

  expect(resolved.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("alias")).toBe("react:preact/compat");
  expect(resolved?.searchParams.get("deps")).toBe("preact@10.5.14");
});

test("tree shaking", () => {
  const resolved = resolveESM("tslib", {
    treeShake: ["__await", "__rest"]
  });

  expect(resolved.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("exports")).toBe("__await,__rest");
});

test("bundle", () => {
  const resolved = resolveESM("tslib", {
    bundle: true
  });

  expect(resolved.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("bundle")).toBe("true");
})
