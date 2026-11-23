import { describe, expect, it } from "vitest";

import { buildESMUrl } from "../src/esm";
import { buildJSDelivrUrl } from "../src/jsdelivr";
import { buildUnpkgUrl } from "../src/unpkg";

type BuildCdnUrl = (module: string) => URL | undefined;

interface BuilderCase {
  label: string;
  base: string;
  build: BuildCdnUrl;
  /** A valid specifier with dots inside path segments, which must still build. */
  dottedPath: string;
}

const builders: BuilderCase[] = [
  {
    label: "esm.sh",
    base: "https://esm.sh/",
    build: (module) => buildESMUrl(module),
    dottedPath: "next@15/dist/.well-known/a..b.js",
  },
  {
    label: "esm.sh external",
    base: "https://esm.sh/",
    build: (module) => buildESMUrl(module, { external: true }),
    dottedPath: "next@15/dist/.well-known/a..b.js",
  },
  {
    label: "esm.sh JSR",
    base: "https://esm.sh/",
    build: (module) => buildESMUrl(module, { registry: "jsr" }),
    dottedPath: "@std/path@1/.hidden/a..b.ts",
  },
  {
    label: "esm.sh GitHub",
    base: "https://esm.sh/",
    build: (module) => buildESMUrl(module, { registry: "github" }),
    dottedPath: "vercel/next.js@v15.0.0/.github/a..b.js",
  },
  {
    label: "UNPKG",
    base: "https://unpkg.com/",
    build: (module) => buildUnpkgUrl(module),
    dottedPath: "next@15/dist/.well-known/a..b.js",
  },
  {
    label: "esm.unpkg.com",
    base: "https://esm.unpkg.com/",
    build: (module) => buildUnpkgUrl(module, { esm: true }),
    dottedPath: "next@15/dist/.well-known/a..b.js",
  },
  {
    label: "jsDelivr",
    base: "https://cdn.jsdelivr.net/npm/",
    build: (module) => buildJSDelivrUrl(module),
    dottedPath: "next@15/dist/.well-known/a..b.js",
  },
  {
    label: "jsDelivr ESM",
    base: "https://cdn.jsdelivr.net/npm/",
    build: (module) => buildJSDelivrUrl(module, { esm: true }),
    dottedPath: "next@15/dist/.well-known/a..b.js",
  },
];

const escapingSpecifiers = [
  "javascript:alert(1)",
  "http:evil.example",
  "data:text/javascript,alert(1)",
  "react@18/../../evil",
  "react@18/%2e%2e/%2E%2E/evil",
  "react@18/.%2e/.%2E/evil",
  "react@18/./evil",
  "react@18\\..\\..\\evil",
  "react@1\\..\\..\\evil",
  "react@18/.\t./.\n./evil",
  "@std/encoding/../../../evil",
  "owner/repo/../../evil",
  "owner/../../evil",
];

describe.each(builders)("$label", ({ base, build, dottedPath }) => {
  it.each(escapingSpecifiers)("returns undefined for %j", (specifier) => {
    expect(build(specifier)).toBeUndefined();
  });

  it("keeps dots that are only part of a path segment", () => {
    const url = build(dottedPath);
    expect(url?.href.startsWith(base)).toBe(true);
    expect(url?.pathname).toContain("a..b");
  });
});

/**
 * Generates specifiers from a known package start and three risky fragments.
 */
function* generateSpecifiers(): Generator<string> {
  const starts = ["", "react", "react@1", "@s/n", "@s/n@1", "o/r", "o/r@v1"];
  const fragments = ["", "a", "@", "/", ".", "..", ":", "\\", "%2e", "?", "#", "\t"];
  for (const start of starts) {
    for (const first of fragments) {
      for (const second of fragments) {
        for (const third of fragments) {
          yield start + first + second + third;
        }
      }
    }
  }
}

it("never builds a URL outside its CDN", () => {
  const escapes: string[] = [];
  let built = 0;

  for (const specifier of generateSpecifiers()) {
    for (const { label, base, build } of builders) {
      const url = build(specifier);
      if (!url) continue;
      built++;
      if (url.protocol !== "https:" || !(url.origin + url.pathname).startsWith(base)) {
        escapes.push(label + " " + JSON.stringify(specifier) + " -> " + url.href);
      }
    }
  }

  expect(escapes).toEqual([]);
  expect(built).toBeGreaterThan(1000);
});
