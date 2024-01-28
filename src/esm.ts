import { parsePackage } from "./parse";

export interface ESMOptions {
  /**
   * By default, esm.sh rewrites import specifiers based on the package dependencies.
   * To specify the version of these dependencies, you can add the
   * `?deps=PACKAGE@VERSION` query. To specify multiple dependencies, separate them
   * with a comma, like this: `?deps=react@17.0.2,react-dom@17.0.2`.
   *
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
   *
   * By default, esm.sh exports a module with all its exported members. However, if
   * you want to import only a specific set of members, you can specify them by
   * adding a `?exports=foo,bar` query to the import statement.
   *
   *
   * ```ts
   * import { __await, __rest } from "https://esm.sh/tslib"; // 7.3KB
   * import { __await, __rest } from "https://esm.sh/tslib?exports=__await,__rest"; // 489B
   * ```
   */
  treeShake?: string[];

  /**
   * By default, esm.sh bundles sub-modules that ain't declared in the `exports` field.
   *
   * You can also bundle all dependencies of a package into a single JS file by
   * adding `?bundle-deps` query to the import URL:
   *
   * ```ts
   * import { Button } from "https://esm.sh/antd?bundle-deps";
   * ```
   *
   * Bundling deps can reduce the number of network requests and improve performance.
   * However, it may bundle shared code repeatedly. In extreme case, it may break the
   * side effects of the package, or change the `import.meta.url` pointing. To avoid
   * this, you can add `?no-bundle` to disable the default bundling behavior:
   *
   * ```ts
   * import "https://esm.sh/@pyscript/core?no-bundle";
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
     * The target environment for the generated code
     *
     * ```ts
     * import React from "https://esm.sh/react?target=es2020";
     * ```
     */
    target?: "es2015" | "es2022" | "esnext" | "deno" | "denonext" | "node";

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
   * Alternatively, you can mark all dependencies as external by adding a `*`
   * before the package name
   * ```ts
   * import useSWR from "https://esm.sh/*swr";
   * ```
   */
  external?: string[] | boolean;

  /**
   * To ensure stable and consistent behavior, you may want to pin the build version
   * of a module you're using from esm.sh. This helps you avoid potential breaking
   * changes in the module caused by updates to the esm.sh server.
   *
   * The `?pin` query allows you to specify a specific build version of a module,
   * which is an **immutable** cached version stored on the esm.sh CDN.
   *
   * ```ts
   * import React from "https://esm.sh/react-dom?pin=v135";
   * // or use version prefix
   * import React from "https://esm.sh/v135/react-dom";
   * ```
   *
   * By using the `?pin` query in the import statement, you can rest assured that the
   * version of the module you're using will not change, even if updates are pushed
   * to the esm.sh server. This helps ensure the stability and reliability of your
   * application.
   *
   * For UI libraries like _React_ and _Vue_, esm.sh uses a special build version
   * `stable` to ensure single version of the library is used in the whole
   * application.
   */
  pin?: string;

  /**
   * Removes the x-typescript-types header when requesting url
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

/**
 * Builds the URL for esm.sh
 *
 * @param {string} module - The module name.
 * @param {ESMOptions?} options - options for building the URL.
 * @returns {URL | undefined} URL for the ESM, or undefined if an error occurs.
 */
export function buildESMUrl(
  module: string,
  options?: ESMOptions,
): URL | undefined {
  try {
    const pkg = parsePackage(module);

    const url = new URL(
      `${options?.external === true ? "*" : ""}${pkg.full}`,
      "https://esm.sh/",
    );

    if (options?.deps) {
      url.searchParams.append("deps", options.deps.join(","));
    }

    if (options?.alias) {
      url.searchParams.append(
        "alias",
        Object.entries(options.alias)
          .map(([key, value]) => `${key}:${value}`)
          .join(","),
      );
    }

    if (options?.treeShake) {
      url.searchParams.append("exports", options.treeShake.join(","));
    }

    if (options?.bundle) {
      url.searchParams.append("bundle", options.bundle);
    }

    if (options?.dev) {
      url.searchParams.append("dev", "true");
    }

    if (options?.esbuild) {
      if (options.esbuild.target) {
        url.searchParams.append("target", options.esbuild.target);
      }

      if (options.esbuild.conditions) {
        url.searchParams.append(
          "conditions",
          options.esbuild.conditions.join(","),
        );
      }

      if (options.esbuild.keepNames) {
        url.searchParams.append("keep-names", "true");
      }

      if (options.esbuild.ignoreAnnotations) {
        url.searchParams.append("ignore-annotations", "true");
      }
    }

    if (options?.worker) {
      url.searchParams.append("worker", "true");
    }

    if (options?.css) {
      url.searchParams.append("css", "true");
    }

    if (options?.wasm) {
      url.searchParams.append("module", "true");
    }

    if (options?.external && Array.isArray(options.external)) {
      url.searchParams.append("external", options.external.join(","));
    }

    if (options?.pin) {
      url.searchParams.append("pin", options.pin);
    }

    if (options?.noDts) {
      url.searchParams.append("no-dts", "true");
    }

    if (options?.raw) {
      url.searchParams.append("raw", "true");
    }

    return url;
  } catch (err) {
    return undefined;
  }
}

/**
 * Resolves the ESM types for a given URL.
 *
 * @param {URL | string} url - The URL or string representation of the URL.
 * @returns {Promise<string | null>} A promise that resolves to a string representing the ESM types, or null if not found.
 */
export async function resolveESMTypes(
  url: URL | string,
): Promise<string | null> {
  if (url instanceof URL) {
    url = url.toString();
  }

  const headers = await fetch(url).then((res) => res.headers);
  return headers.get("x-typescript-types");
}
