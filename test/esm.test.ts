
import { describe, expect, test } from "vitest";

import { resolveESM, resolveESMTypes } from "../src/esm";

test("resolve react", () => {
  const resolved = resolveESM("react");

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.pathname).toBe("/react@latest");
});

test("resolve react@17", () => {
  const resolved = resolveESM("react@17");
  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.pathname).toBe("/react@17");
});

test("resolve swr with preact alias", () => {
  const resolved = resolveESM("swr", {
    alias: {
      react: "preact/compat"
    }
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("alias")).toBe("react:preact/compat");
});

test("resolve swr with preact alias and deps", () => {
  const resolved = resolveESM("swr", {
    alias: {
      react: "preact/compat"
    },
    deps: ["preact@10.5.14"]
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("alias")).toBe("react:preact/compat");
  expect(resolved?.searchParams.get("deps")).toBe("preact@10.5.14");
});

test("tree shaking", () => {
  const resolved = resolveESM("tslib", {
    treeShake: ["__await", "__rest"]
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("exports")).toBe("__await,__rest");
});

test("with bundle mode", () => {
  const resolved = resolveESM("tslib", {
    bundle: true
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("bundle")).toBe("true");
});

test("with worker", () => {
  const resolved = resolveESM("monaco-editor/esm/vs/editor/editor.worker", {
    worker: true
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("worker")).toBe("true");
});

test("with development mode", () => {
  const resolved = resolveESM("react", {
    dev: true
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("dev")).toBe("true");
});

describe("esbuild options", () => {
  test("with target", () => {
    const resolved = resolveESM("react", {
      esbuild: {
        target: "esnext"
      }
    });

    expect(resolved?.host).toBe("esm.sh");
    expect(resolved?.searchParams.get("target")).toBe("esnext");
  });

  test("with keep-names", () => {
    const resolved = resolveESM("react", {
      esbuild: {
        keepNames: true
      }
    });

    expect(resolved?.host).toBe("esm.sh");
    expect(resolved?.searchParams.get("keep-names")).toBe("true");
  });

  test("with target", () => {
    const resolved = resolveESM("react", {
      esbuild: {
        ignoreAnnotations: true
      }
    });

    expect(resolved?.host).toBe("esm.sh");
    expect(resolved?.searchParams.get("ignore-annotations")).toBe("true");
  });
});

test("cjs exports", () => {
  const resolved = resolveESM("react-svg-spinners@0.3.1", {
    cjsExports: ["NinetyRing", "NinetyRingWithBg"]
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("cjs-exports")).toBe(
    "NinetyRing,NinetyRingWithBg"
  );
});

test("pinned build version", () => {
  const resolved = resolveESM("react-dom", {
    pin: "v111"
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("pin")).toBe("v111");
});

test("resolve vue types", async () => {
  const esm = resolveESM("vue@3.2.47");

  const resolved = await resolveESMTypes(esm!);
  console.log(resolved);
  const resolvedURL = new URL(resolved!);

  expect(resolvedURL.host).toBe("esm.sh");
  expect(resolvedURL.pathname).toContain("/vue@3.2.47/dist/vue.d.ts");
});

test("resolve vue types without header", async () => {
  const esm = resolveESM("vue@3.2.47", {
    noDts: true
  });
  const resolved = await resolveESMTypes(esm!);

  expect(resolved).toBe(null);
});
