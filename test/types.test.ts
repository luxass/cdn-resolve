import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  Builder,
  ESMOptions,
  JSDelivrOptions,
  SupportedCDNS,
  UnpkgESMOptions,
  UnpkgOptions,
} from "../src";
import { buildCDNUrl, buildJSDelivrUrl } from "../src";

/** A builder written before jsDelivr accepted options. */
const legacyBuilder: Builder<"jsdelivr"> = (module: string) => buildJSDelivrUrl(module);

// `pnpm typecheck` checks these assertions. The test runner only runs the
// calls, which must not throw.
describe("public types", () => {
  it("lists the supported CDNs", () => {
    expectTypeOf<SupportedCDNS>().toEqualTypeOf<"esm" | "unpkg" | "jsdelivr">();
  });

  it("types the options of each builder", () => {
    expectTypeOf(buildCDNUrl("esm")).parameter(1).toEqualTypeOf<ESMOptions | undefined>();
    expectTypeOf(buildCDNUrl("unpkg")).parameter(1).toEqualTypeOf<UnpkgOptions | undefined>();
    expectTypeOf(buildCDNUrl("jsdelivr")).parameter(1).toEqualTypeOf<JSDelivrOptions | undefined>();
    expectTypeOf(buildCDNUrl("esm")).returns.toEqualTypeOf<URL | undefined>();
  });

  it("accepts a one-argument function as a jsDelivr builder", () => {
    expect(legacyBuilder("preact@10")?.href).toBe("https://cdn.jsdelivr.net/npm/preact@10");
  });

  it("accepts the esm option as a boolean or as build options", () => {
    expectTypeOf<UnpkgOptions["esm"]>().toEqualTypeOf<boolean | UnpkgESMOptions | undefined>();
  });

  it("rejects options that a CDN does not support", () => {
    // @ts-expect-error esm.unpkg.com does not support the denonext target.
    const unpkgTarget: UnpkgESMOptions = { target: "denonext" };
    // @ts-expect-error esm.sh has no deno registry.
    const esmRegistry: ESMOptions = { registry: "deno" };
    // @ts-expect-error jsDelivr has no dev option.
    const jsDelivrOptions: JSDelivrOptions = { dev: true };

    expect([unpkgTarget, esmRegistry, jsDelivrOptions]).toHaveLength(3);
  });

  it("rejects CDN names that are not supported", () => {
    expect(() => {
      // @ts-expect-error Skypack is no longer supported.
      buildCDNUrl("skypack");
    }).toThrowError("Unknown CDN: skypack");
  });
});
