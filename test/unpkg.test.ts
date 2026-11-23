import { describe, expect, it } from "vitest";

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

it("selects package export conditions separately from the module query", () => {
  const url = buildUnpkgUrl("react@19", {
    conditions: ["react-server", "development"],
  });
  expect(url?.searchParams.get("conditions")).toBe("react-server,development");
  expect(url?.searchParams.has("module")).toBe(false);
});

it("combines the unpkg.com options in a fixed order", () => {
  const url = buildUnpkgUrl("react@19", { meta: true, module: true, conditions: ["react-server"] });
  expect(url?.href).toBe(
    "https://unpkg.com/react@19?meta=true&module=true&conditions=react-server",
  );
});

it("adds no parameter for empty conditions on unpkg.com", () => {
  expect(buildUnpkgUrl("react", { conditions: [] })?.search).toBe("");
});

describe("esm.unpkg.com", () => {
  it("encodes scoped dependencies and keeps scoped subpaths", () => {
    const url = buildUnpkgUrl("@preact/signals@2.0.0/dist/signals.mjs", {
      esm: { deps: ["@preact/signals-core@1.8.0"] },
    });
    expect(url?.href).toBe(
      "https://esm.unpkg.com/@preact/signals@2.0.0/dist/signals.mjs?deps=%40preact%2Fsignals-core%401.8.0",
    );
  });

  it("adds nothing for empty lists, empty aliases, and disabled flags", () => {
    const url = buildUnpkgUrl("react@19.2.0", {
      conditions: [],
      meta: false,
      esm: { deps: [], alias: {}, external: false, dev: false, min: false },
    });
    expect(url?.href).toBe("https://esm.unpkg.com/react@19.2.0");
  });

  it("sends top-level conditions to esm.unpkg.com", () => {
    expect(buildUnpkgUrl("react@19.2.0", { conditions: ["react-server"], esm: true })?.href).toBe(
      "https://esm.unpkg.com/react@19.2.0?conditions=react-server",
    );
  });

  it("builds a browser module URL with the default build", () => {
    expect(buildUnpkgUrl("react@19.2.0", { esm: true })?.href).toBe(
      "https://esm.unpkg.com/react@19.2.0",
    );
    expect(buildUnpkgUrl("react", { esm: {} })?.href).toBe("https://esm.unpkg.com/react@latest");
  });

  it("keeps unpkg.com when esm is false", () => {
    expect(buildUnpkgUrl("react@19", { esm: false })?.href).toBe("https://unpkg.com/react@19");
  });

  it("writes the canonical query that esm.unpkg.com redirects to", () => {
    const url = buildUnpkgUrl("react@19.2.0", {
      esm: { target: "es2020", dev: true, min: true },
    });
    expect(url?.href).toBe("https://esm.unpkg.com/react@19.2.0?dev=&min=&target=es2020");

    const client = buildUnpkgUrl("react-dom@19.2.0/client", {
      esm: { deps: ["react@19.2.0"], external: ["react", "scheduler"] },
    });
    expect(client?.href).toBe(
      "https://esm.unpkg.com/react-dom@19.2.0/client?deps=react%4019.2.0&external=react%2Cscheduler",
    );
  });

  it("encodes every build option", () => {
    const url = buildUnpkgUrl("preact@10.26.4", {
      conditions: ["browser"],
      meta: true,
      esm: {
        target: "es2024",
        alias: { react: "preact/compat" },
        jsx: "automatic",
        jsxImportSource: "preact",
        sourcemap: true,
        worker: true,
        noDts: true,
        cssModule: true,
        raw: true,
      },
    });

    expect(Array.from(url!.searchParams.entries())).toEqual([
      ["alias", "react:preact/compat"],
      ["conditions", "browser"],
      ["jsx", "automatic"],
      ["jsxImportSource", "preact"],
      ["meta", ""],
      ["module", ""],
      ["no-dts", ""],
      ["raw", ""],
      ["sourcemap", ""],
      ["target", "es2024"],
      ["worker", ""],
    ]);
  });

  it("keeps every dependency external with external: true", () => {
    expect(buildUnpkgUrl("react-dom@19.2.0/client", { esm: { external: true } })?.href).toBe(
      "https://esm.unpkg.com/react-dom@19.2.0/client?external=*",
    );
  });

  it("ignores the module entry option for esm.unpkg.com", () => {
    expect(buildUnpkgUrl("preact@10.26.4", { module: true, esm: true })?.search).toBe("");
  });

  it("returns undefined for an invalid package name", () => {
    expect(buildUnpkgUrl("@scope/", { esm: true })).toBeUndefined();
  });
});
