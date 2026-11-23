import { afterEach, describe, expect, it, vi } from "vitest";

import { buildESMUrl, resolveESMTypes } from "../src/esm";

describe("buildESMUrl", () => {
  it("builds a package URL without options", () => {
    expect(buildESMUrl("react")?.href).toBe("https://esm.sh/react@latest");
  });

  it("prefixes the package with an asterisk to externalize all dependencies", () => {
    const url = buildESMUrl("@scope/pkg@1.2.3/subpath", { external: true });
    expect(url?.href).toBe("https://esm.sh/*@scope/pkg@1.2.3/subpath");
  });

  it("encodes build options as documented by esm.sh", () => {
    const url = buildESMUrl("react", {
      deps: ["react-dom@18", "preact@10"],
      alias: { "react-dom": "preact/compat" },
      treeShake: ["default", "useState"],
      dev: true,
      esbuild: {
        target: "es2024",
        conditions: ["custom1", "custom2"],
        keepNames: true,
        ignoreAnnotations: true,
      },
      worker: true,
      css: true,
      wasm: true,
      external: ["react", "react-dom"],
      pin: "v135",
      noDts: true,
      raw: true,
    });

    expect(Array.from(url!.searchParams.entries())).toEqual([
      ["deps", "react-dom@18,preact@10"],
      ["alias", "react-dom:preact/compat"],
      ["exports", "default,useState"],
      ["dev", "true"],
      ["target", "es2024"],
      ["conditions", "custom1,custom2"],
      ["keep-names", "true"],
      ["ignore-annotations", "true"],
      ["worker", "true"],
      ["css", "true"],
      ["module", "true"],
      ["external", "react,react-dom"],
      ["pin", "v135"],
      ["no-dts", "true"],
      ["raw", "true"],
    ]);
  });

  it("requests the standalone build for bundle-deps", () => {
    expect(buildESMUrl("react", { bundle: "bundle-deps" })?.search).toBe("?standalone=true");
  });

  it("disables bundling for no-bundle", () => {
    expect(buildESMUrl("react", { bundle: "no-bundle" })?.search).toBe("?bundle=false");
  });

  it("omits disabled flags", () => {
    const url = buildESMUrl("react", { dev: false, external: false, noDts: false });
    expect(url?.search).toBe("");
  });
});

describe("resolveESMTypes", () => {
  afterEach(() => vi.unstubAllGlobals());

  const packageUrl = "https://esm.sh/react@18.2.0";
  const typesUrl = "https://esm.sh/@types/react@18.2.0/index.d.ts";

  it.each([packageUrl, new URL(packageUrl)])(
    "reads the type declaration header for %s",
    async (input) => {
      const fetch = vi.fn().mockResolvedValue(
        new Response(null, {
          headers: { "X-TypeScript-Types": typesUrl },
        }),
      );
      vi.stubGlobal("fetch", fetch);

      await expect(resolveESMTypes(input)).resolves.toBe(typesUrl);
      expect(fetch).toHaveBeenCalledWith(packageUrl);
    },
  );

  it("returns null when the header is absent, even on a failed HTTP response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    await expect(resolveESMTypes(packageUrl)).resolves.toBeNull();
  });

  it("propagates fetch failures", async () => {
    const failure = new TypeError("fetch failed");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(failure));
    await expect(resolveESMTypes(packageUrl)).rejects.toBe(failure);
  });
});
