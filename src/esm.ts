import type { ECMAScriptTarget } from "./cdn-url";
import {
  appendQueryFlag,
  appendQueryList,
  CDN_BASE_URLS,
  formatQueryAliases,
  resolveCdnUrl,
} from "./cdn-url";
import { parsePackage } from "./parse";

type ESMRegistry = "npm" | "jsr" | "github";
type ESMTarget = ECMAScriptTarget | "esnext" | "deno" | "denonext" | "node";

export interface ESMOptions {
  /**
   * The registry that esm.sh loads the package from. Defaults to `npm`.
   *
   * With `jsr`, pass a scoped JSR package. The builder adds `latest` when you
   * omit the version, the same as for npm:
   *
   * ```ts
   * buildESMUrl("@std/encoding@1.0.0/base64", { registry: "jsr" });
   * // => https://esm.sh/jsr/@std/encoding@1.0.0/base64
   * ```
   *
   * With `github`, pass `owner/repo`, an optional tag, branch, or commit, and an
   * optional path. Without a reference, esm.sh uses the default branch. esm.sh
   * also transforms `.ts`, `.tsx`, `.vue`, and `.svelte` files from GitHub:
   *
   * ```ts
   * buildESMUrl("microsoft/tslib@v2.8.0", { registry: "github" });
   * // => https://esm.sh/gh/microsoft/tslib@v2.8.0
   * ```
   */
  registry?: ESMRegistry;

  /**
   * By default, esm.sh rewrites import specifiers based on the package dependencies.
   * To specify the version of these dependencies, you can add the
   * `?deps=PACKAGE@VERSION` query. To specify multiple dependencies, separate them
   * with a comma, like this: `?deps=react@17.0.2,react-dom@17.0.2`.
   *
   * ```ts
   * import React from "https://esm.sh/react@17.0.2";
   * import useSWR from "https://esm.sh/swr?deps=react@17.0.2";
   * ```
   */
  deps?: string[];

  /**
   * A list of modules to alias to other modules
   *
   * ```ts
   * import useSWR from "https://esm.sh/swr?alias=react:preact/compat";
   * ```
   * in combination with ?deps:
   * ```ts
   * import useSWR from "https://esm.sh/swr?alias=react:preact/compat&deps=preact@10.5.14";
   * ```
   */
  alias?: Record<string, string>;

  /**
   * By default, esm.sh exports a module with all its exported members. However, if
   * you want to import only a specific set of members, you can specify them by
   * adding a `?exports=foo,bar` query to the import statement.
   *
   * ```ts
   * import { __await, __rest } from "https://esm.sh/tslib"; // 7.3KB
   * import { __await, __rest } from "https://esm.sh/tslib?exports=__await,__rest"; // 489B
   * ```
   */
  treeShake?: string[];

  /**
   * By default, esm.sh bundles sub-modules that are not declared in the `exports` field.
   *
   * Use `bundle-deps` to bundle all dependencies of a package, except peer
   * dependencies, into a single JS file. The builder adds the `?standalone` query:
   *
   * ```ts
   * import { Button } from "https://esm.sh/antd?standalone=true";
   * ```
   *
   * Bundling deps can reduce the number of network requests and improve performance.
   * However, it may bundle shared code repeatedly. In extreme cases, it may break the
   * side effects of the package, or change the `import.meta.url` pointing. To avoid
   * this, use `no-bundle` to disable the default bundling behavior. The builder adds
   * the `?bundle=false` query:
   *
   * ```ts
   * import "https://esm.sh/@pyscript/core?bundle=false";
   * ```
   */
  bundle?: "bundle-deps" | "no-bundle";

  /**
   * With the `?dev` option, esm.sh builds a module with `process.env.NODE_ENV` set
   * to `"development"` or based on the condition `development` in the `exports`
   * field. This is useful for libraries that have different behavior in development
   * and production. For example, React will use a different warning message in
   * development mode.
   *
   * ```ts
   * import React from "https://esm.sh/react?dev";
   * ```
   */
  dev?: boolean;

  /**
   * By default, esm.sh checks the `User-Agent` header to determine the build target.
   */
  esbuild?: {
    /**
     * The target environment for the generated code. esm.sh supports every
     * ECMAScript year from `es2015` to `es2024`, plus `esnext`, `deno`,
     * `denonext`, and `node`.
     *
     * ```ts
     * import React from "https://esm.sh/react?target=es2020";
     * ```
     */
    target?: ESMTarget;

    /**
     * Use custom conditions for the build
     * @see https://esbuild.github.io/api/#conditions
     *
     * ```ts
     * import foo from "https://esm.sh/foo?conditions=custom1,custom2";
     * ```
     */
    conditions?: string[];

    /**
     * Keep names when minifying
     * @see https://esbuild.github.io/api/#keep-names
     *
     * ```ts
     * import foo from "https://esm.sh/foo?keep-names";
     * ```
     */
    keepNames?: boolean;

    /**
     * Ignore annotations when building
     * @see https://esbuild.github.io/api/#ignore-annotations
     *
     * ```ts
     * import foo from "https://esm.sh/foo?ignore-annotations";
     * ```
     */
    ignoreAnnotations?: boolean;
  };

  /**
   * esm.sh supports `?worker` query to load the module as a web worker:
   *
   * ```js
   * import workerFactory from "https://esm.sh/monaco-editor/esm/vs/editor/editor.worker?worker";
   *
   * const worker = workerFactory();
   * ```
   *
   * You can pass some custom code snippet to the worker when calling the factory
   * function:
   *
   * ```js
   * const workerAddon = `
   * self.onmessage = function (e) {
   *   console.log(e.data)
   * }
   * `;
   * const worker = workerFactory(workerAddon);
   * ```
   */
  worker?: boolean;

  /**
   * ```html
   * <link rel="stylesheet" href="https://esm.sh/monaco-editor?css">
   * ```
   *
   * This only works when the package **imports CSS files in JS** directly.
   */
  css?: boolean;

  /**
   * esm.sh supports importing wasm modules in JS directly, to do that, you need to
   * add `?module` query to the import URL:
   *
   * ```ts
   * import wasm from "https://esm.sh/@dqbd/tiktoken@1.0.3/tiktoken_bg.wasm?module";
   *
   * const { exports } = new WebAssembly.Instance(wasm, imports);
   * ```
   */
  wasm?: boolean;

  /**
   * A list of dependencies to externalize from the bundle
   *
   * ```ts
   * import useSWR from "https://esm.sh/swr?external=react";
   * ```
   *
   * Use `preact/*` to keep only the subpath imports, such as `preact/hooks`, as
   * bare imports. Use `preact` to keep both the package and its subpaths.
   *
   * Alternatively, you can mark all dependencies as external by adding a `*`
   * before the package name
   * ```ts
   * import useSWR from "https://esm.sh/*swr";
   * ```
   */
  external?: string[] | boolean;

  /**
   * Requests a legacy esm.sh build version with the `?pin` query.
   *
   * ```ts
   * import React from "https://esm.sh/react-dom?pin=v135";
   * ```
   *
   * esm.sh only serves `?pin` for older build versions, and it does not guarantee
   * an immutable build. To keep a module stable, pin an exact package version,
   * such as `react-dom@18.3.1`, instead.
   */
  pin?: string;

  /**
   * Removes the `X-TypeScript-Types` header from the response with the
   * `?no-dts` query. esm.sh still builds the module.
   */
  noDts?: boolean;

  /**
   * In rare cases, you may want to request JS source files from packages, as-is,
   * without transformation into ES modules. To do so, you need to add a `?raw`
   * query to the request URL.
   *
   * For example, you might need to register a package's source script as a service worker
   * in a browser that [does not yet support](https://caniuse.com/mdn-api_serviceworker_ecmascript_modules)
   * the `type: "module"` option:
   *
   * ```js
   * await navigator.serviceWorker.register(
   *   new URL(
   *     "https://esm.sh/playground-elements/playground-service-worker.js?raw",
   *     import.meta.url.href
   *   ),
   *   { scope: '/' }
   * );
   * ```
   */
  raw?: boolean;
}

const GITHUB_REPOSITORY_SPECIFIER = /^[^/@]+\/[^/@]+(?:@[^/]+)?(?:\/.*)?$/u;

/**
 * Formats the esm.sh path for a package from one of the supported registries.
 *
 * @throws Error if the module is not valid for the registry.
 */
function formatESMPackagePath(module: string, registry: ESMRegistry = "npm"): string {
  if (registry === "github") {
    if (!GITHUB_REPOSITORY_SPECIFIER.test(module)) {
      throw new Error(`Invalid GitHub repository: ${module}`);
    }
    return `gh/${module}`;
  }

  const pkg = parsePackage(module);
  if (registry === "jsr") {
    if (!pkg.scope) {
      throw new Error(`Invalid JSR package name: ${module}`);
    }
    return `jsr/${pkg.full}`;
  }
  if (registry !== "npm") {
    throw new Error(`Unknown esm.sh registry: ${String(registry)}`);
  }
  return pkg.full;
}

/**
 * Builds the URL for esm.sh
 *
 * @param {string} module - The module name.
 * @param {ESMOptions?} options - options for building the URL.
 * @returns {URL | undefined} URL for the ESM, or undefined if an error occurs.
 */
export function buildESMUrl(module: string, options?: ESMOptions): URL | undefined {
  try {
    const external = options?.external === true ? "*" : "";
    const url = resolveCdnUrl(
      CDN_BASE_URLS.esm,
      external + formatESMPackagePath(module, options?.registry),
    );
    if (!options) return url;

    const params = url.searchParams;
    appendQueryList(params, "deps", options.deps);
    appendQueryList(params, "alias", formatQueryAliases(options.alias));
    appendQueryList(params, "exports", options.treeShake);

    if (options.bundle === "bundle-deps") {
      params.append("standalone", "true");
    } else if (options.bundle === "no-bundle") {
      params.append("bundle", "false");
    }
    appendQueryFlag(params, "dev", options.dev);

    const { esbuild } = options;
    if (esbuild?.target) params.append("target", esbuild.target);
    appendQueryList(params, "conditions", esbuild?.conditions);
    appendQueryFlag(params, "keep-names", esbuild?.keepNames);
    appendQueryFlag(params, "ignore-annotations", esbuild?.ignoreAnnotations);

    appendQueryFlag(params, "worker", options.worker);
    appendQueryFlag(params, "css", options.css);
    appendQueryFlag(params, "module", options.wasm);
    if (Array.isArray(options.external)) appendQueryList(params, "external", options.external);
    if (options.pin) params.append("pin", options.pin);
    appendQueryFlag(params, "no-dts", options.noDts);
    appendQueryFlag(params, "raw", options.raw);
    return url;
  } catch {
    return undefined;
  }
}

/**
 * Resolves the ESM types for a given URL.
 *
 * @param {URL | string} url - The URL or string representation of the URL.
 * @returns {Promise<string | null>} A promise that resolves to a string representing the ESM types, or null if not found.
 */
export async function resolveESMTypes(url: URL | string): Promise<string | null> {
  const response = await fetch(url instanceof URL ? url.toString() : url);
  return response.headers.get("x-typescript-types");
}
