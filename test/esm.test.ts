import { describe, expect, it } from "vitest";

import { resolveESM, resolveESMTypes } from "../src/esm";

it("resolve react", () => {
  const resolved = resolveESM("react");

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.pathname).toBe("/react@latest");
});

it("resolve react@17", () => {
  const resolved = resolveESM("react@17");
  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.pathname).toBe("/react@17");
});

it("resolve swr with preact alias", () => {
  const resolved = resolveESM("swr", {
    alias: {
      react: "preact/compat",
    },
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("alias")).toBe("react:preact/compat");
});

it("resolve swr with preact alias and deps", () => {
  const resolved = resolveESM("swr", {
    alias: {
      react: "preact/compat",
    },
    deps: ["preact@10.5.14"],
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("alias")).toBe("react:preact/compat");
  expect(resolved?.searchParams.get("deps")).toBe("preact@10.5.14");
});

it("tree shaking", () => {
  const resolved = resolveESM("tslib", {
    treeShake: ["__await", "__rest"],
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("exports")).toBe("__await,__rest");
});

it("with bundle mode", () => {
  const resolved = resolveESM("tslib", {
    bundle: true,
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("bundle")).toBe("true");
});

it("with worker", () => {
  const resolved = resolveESM("monaco-editor/esm/vs/editor/editor.worker", {
    worker: true,
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("worker")).toBe("true");
});

it("with development mode", () => {
  const resolved = resolveESM("react", {
    dev: true,
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("dev")).toBe("true");
});

describe("esbuild options", () => {
  it("with target", () => {
    const resolved = resolveESM("react", {
      esbuild: {
        target: "esnext",
      },
    });

    expect(resolved?.host).toBe("esm.sh");
    expect(resolved?.searchParams.get("target")).toBe("esnext");
  });

  it("with keep-names", () => {
    const resolved = resolveESM("react", {
      esbuild: {
        keepNames: true,
      },
    });

    expect(resolved?.host).toBe("esm.sh");
    expect(resolved?.searchParams.get("keep-names")).toBe("true");
  });

  it("with ignore annotations", () => {
    const resolved = resolveESM("react", {
      esbuild: {
        ignoreAnnotations: true,
      },
    });

    expect(resolved?.host).toBe("esm.sh");
    expect(resolved?.searchParams.get("ignore-annotations")).toBe("true");
  });
});

it("cjs exports", () => {
  const resolved = resolveESM("react-svg-spinners@0.3.1", {
    cjsExports: ["NinetyRing", "NinetyRingWithBg"],
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("cjs-exports")).toBe(
    "NinetyRing,NinetyRingWithBg",
  );
});

it("pinned build version", () => {
  const resolved = resolveESM("react-dom", {
    pin: "v111",
  });

  expect(resolved?.host).toBe("esm.sh");
  expect(resolved?.searchParams.get("pin")).toBe("v111");
});

it("resolve vue types", async () => {
  const esm = resolveESM("vue@3.2.47");

  const resolved = await resolveESMTypes(esm!);
  const resolvedURL = new URL(resolved!);

  expect(resolvedURL.host).toBe("esm.sh");
  expect(resolvedURL.pathname).toContain("/vue@3.2.47/dist/vue.d.ts");
});

it("resolve vue types without header", async () => {
  const esm = resolveESM("vue@3.2.47", {
    noDts: true,
  });
  const resolved = await resolveESMTypes(esm!);

  expect(resolved).toBe(null);
});
