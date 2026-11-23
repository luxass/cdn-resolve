import type { ECMAScriptTarget } from "./cdn-url";
import {
  appendQueryFlag,
  appendQueryList,
  createCdnPackageUrl,
  formatQueryAliases,
  resolveCdnUrl,
  UNPKG_ESM_BASE_URL,
} from "./cdn-url";
import { parsePackage } from "./parse";

type UnpkgESMTarget = ECMAScriptTarget | "esnext" | "deno" | "node";

/**
 * Build options for esm.unpkg.com.
 *
 * esm.unpkg.com redirects every request to a canonical URL. The builder writes
 * that form directly, with flags such as `?dev=` and the query keys sorted.
 */
export interface UnpkgESMOptions {
  /**
   * The output target. esm.unpkg.com supports every ECMAScript year from
   * `es2015` to `es2024`, plus `esnext`, `deno`, and `node`. Defaults to
   * `es2022`.
   *
   * ```ts
   * import React from "https://esm.unpkg.com/react@19.2.0?target=es2020";
   * ```
   */
  target?: UnpkgESMTarget;

  /**
   * Uses the development export conditions and sets `NODE_ENV` to
   * `"development"` with the `?dev` query.
   */
  dev?: boolean;

  /**
   * Pins or overrides the dependency versions that the build uses, for example
   * `["react@19.2.0"]`.
   *
   * ```ts
   * import { createRoot } from "https://esm.unpkg.com/react-dom@19.2.0/client?deps=react%4019.2.0";
   * ```
   */
  deps?: string[];

  /**
   * Rewrites one package specifier to another during resolution, for example
   * `{ react: "preact/compat" }`.
   */
  alias?: Record<string, string>;

  /**
   * Leaves the listed dependencies as bare imports instead of rewriting them to
   * UNPKG URLs. Pass `true` to keep every dependency external, which adds
   * `?external=*`.
   *
   * Use this with an import map that resolves the bare imports.
   */
  external?: string[] | boolean;

  /**
   * The JSX transform mode, for example `automatic`.
   */
  jsx?: string;

  /**
   * The JSX import source, for example `preact`.
   */
  jsxImportSource?: string;

  /**
   * Minifies the output with the `?min` query.
   */
  min?: boolean;

  /**
   * Emits a source map with the module with the `?sourcemap` query.
   */
  sourcemap?: boolean;

  /**
   * Builds the worker variant of the module with the `?worker` query. The
   * module exports a function that creates the worker:
   *
   * ```js
   * import createWorker from "https://esm.unpkg.com/xxhash-wasm@1.0.2?worker=";
   *
   * const worker = createWorker();
   * ```
   */
  worker?: boolean;

  /**
   * Skips TypeScript declaration handling with the `?no-dts` query.
   */
  noDts?: boolean;

  /**
   * Turns a `.css` file into a module that exports a constructable
   * `CSSStyleSheet`, which you can adopt in a document or shadow root. The
   * builder adds the `?module` query:
   *
   * ```js
   * import sheet from "https://esm.unpkg.com/modern-normalize@3.0.1/modern-normalize.css?module=";
   *
   * document.adoptedStyleSheets = [sheet];
   * ```
   */
  cssModule?: boolean;

  /**
   * Serves the underlying file without transforming it, with the `?raw` query.
   * esm.unpkg.com rejects `raw` together with any build option.
   */
  raw?: boolean;
}

export interface UnpkgOptions {
  /**
   * Asks UNPKG for the package's `module` entry with the `?module` query.
   * UNPKG serves the published file and does not transform it.
   *
   * ```ts
   * buildUnpkgUrl("preact@10.26.4", { module: true });
   * // => https://unpkg.com/preact@10.26.4?module=true
   * ```
   *
   * The builder ignores this option for esm.unpkg.com.
   *
   * @deprecated UNPKG no longer documents the `?module` query, so it can stop
   * working without notice. Use `esm` for a browser-ready ES module, or
   * `conditions` to select an export condition.
   */
  module?: boolean;

  /**
   * On unpkg.com, lists the published files at this path with the `?meta`
   * query. Each file has its size, MIME type, and SHA-256 integrity hash.
   *
   * ```ts
   * buildUnpkgUrl("react@19", { meta: true });
   * // => https://unpkg.com/react@19?meta=true
   * ```
   *
   * With `esm`, returns JSON metadata about the built module instead of code.
   * esm.unpkg.com rejects `meta` together with `cssModule` or `worker`.
   */
  meta?: boolean;

  /**
   * Selects custom conditions from the package's `exports` field with the
   * `?conditions` query. Both unpkg.com and esm.unpkg.com support it.
   *
   * ```ts
   * buildUnpkgUrl("react@19", { conditions: ["react-server"] });
   * // => https://unpkg.com/react@19?conditions=react-server
   * ```
   */
  conditions?: string[];

  /**
   * Builds the URL for esm.unpkg.com, which converts the package into a
   * browser-ready ES module. Pass `true` for the default build, or an object
   * to set build options.
   *
   * ```ts
   * buildUnpkgUrl("react-dom@19.2.0/client", { esm: { deps: ["react@19.2.0"] } });
   * // => https://esm.unpkg.com/react-dom@19.2.0/client?deps=react%4019.2.0
   * ```
   *
   * Without a pinned version, esm.unpkg.com redirects to the resolved version.
   */
  esm?: boolean | UnpkgESMOptions;
}

/**
 * Builds an esm.unpkg.com URL in the canonical form that the CDN redirects to.
 *
 * @throws Error if the package name is invalid.
 */
function buildUnpkgESMUrl(module: string, options: UnpkgOptions, build: UnpkgESMOptions): URL {
  const url = resolveCdnUrl(UNPKG_ESM_BASE_URL, parsePackage(module).full);
  const params = url.searchParams;

  if (build.target) params.set("target", build.target);
  appendQueryFlag(params, "dev", build.dev, "");
  appendQueryList(params, "conditions", options.conditions);
  appendQueryList(params, "deps", build.deps);
  appendQueryList(params, "alias", formatQueryAliases(build.alias));
  if (build.external === true) {
    params.set("external", "*");
  } else if (build.external) {
    appendQueryList(params, "external", build.external);
  }
  if (build.jsx) params.set("jsx", build.jsx);
  if (build.jsxImportSource) params.set("jsxImportSource", build.jsxImportSource);
  appendQueryFlag(params, "min", build.min, "");
  appendQueryFlag(params, "sourcemap", build.sourcemap, "");
  appendQueryFlag(params, "worker", build.worker, "");
  appendQueryFlag(params, "no-dts", build.noDts, "");
  appendQueryFlag(params, "module", build.cssModule, "");
  appendQueryFlag(params, "raw", build.raw, "");
  appendQueryFlag(params, "meta", options.meta, "");

  params.sort();
  return url;
}

/**
 * Builds the URL for the specified module on unpkg.com.
 *
 * With the `esm` option, builds the URL for esm.unpkg.com instead.
 *
 * @param {string} module - The name of the module.
 * @param {UnpkgOptions} options - configuration options.
 * @returns {URL | undefined} The URL for the module on unpkg.com, or undefined if the module name is invalid.
 */
export function buildUnpkgUrl(module: string, options?: UnpkgOptions): URL | undefined {
  try {
    if (options?.esm) {
      return buildUnpkgESMUrl(module, options, options.esm === true ? {} : options.esm);
    }

    const url = createCdnPackageUrl("unpkg", module);
    if (options?.meta) {
      url.searchParams.set("meta", "true");
    }
    if (options?.module) {
      url.searchParams.set("module", "true");
    }
    appendQueryList(url.searchParams, "conditions", options?.conditions);
    return url;
  } catch {
    return undefined;
  }
}
