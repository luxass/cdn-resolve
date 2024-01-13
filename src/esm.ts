import { ofetch } from "ofetch";

import { parsePackage } from "./utils";

export interface ESMOptions {
  deps?: string[]

  /**
   * A list of dependencies to externalize
   * if true, all dependencies will be externalized
   */
  external?: string[] | boolean

  /**
   * Pin a specific version to a module
   */
  pin?: string

  esbuild?: {
    /**
     * The target environment for the generated code
     */
    target?: "es2015" | "es2022" | "esnext" | "deno" | "denonext"

    /**
     * Keep names when minifying
     * https://esbuild.github.io/api/#keep-names
     */
    keepNames?: boolean

    /**
     * Ignore annotations when building
     * https://esbuild.github.io/api/#ignore-annotations
     */
    ignoreAnnotations?: boolean
  }

  /**
   * A list of modules to alias to other modules
   */
  alias?: Record<string, string>
  /**
   * To enable tree shaking, you need to specify the list of exports to keep
   */
  treeShake?: string[]
  /**
   * Bundle
   */
  bundle?: boolean

  /**
   * Development Mode
   */
  dev?: boolean

  /**
   * Worker Mode
   */
  worker?: boolean

  /**
   * CJS Exports
   */
  cjsExports?: string[]

  /**
   * Removes the x-typescript-types header when requesting url
   */
  noDts?: boolean
}

export function resolveESM(
  module: string,
  options?: ESMOptions,
): URL | undefined {
  try {
    const pkg = parsePackage(module);

    const url = new URL(
      `${options?.external === true ? "*" : ""}${pkg.full}`,
      "https://esm.sh",
    );

    if (options?.deps) {
      url.searchParams.append("deps", options.deps.join(","));
    }

    if (options?.external) {
      if (Array.isArray(options.external)) {
        url.searchParams.append("external", options.external.join(","));
      }
    }

    if (options?.pin) {
      url.searchParams.append("pin", options.pin);
    }

    if (options?.esbuild) {
      if (options.esbuild.target) {
        url.searchParams.append("target", options.esbuild.target);
      }

      if (options.esbuild.keepNames) {
        url.searchParams.append("keep-names", "true");
      }

      if (options.esbuild.ignoreAnnotations) {
        url.searchParams.append("ignore-annotations", "true");
      }
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
      url.searchParams.append("bundle", "true");
    }

    if (options?.dev) {
      url.searchParams.append("dev", "true");
    }

    if (options?.worker) {
      url.searchParams.append("worker", "true");
    }

    if (options?.cjsExports) {
      url.searchParams.append("cjs-exports", options.cjsExports.join(","));
    }

    if (options?.noDts) {
      url.searchParams.append("no-dts", "true");
    }

    return url;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export async function resolveESMTypes(
  url: URL | string,
): Promise<string | null> {
  if (url instanceof URL) {
    url = url.toString();
  }

  const headers = await ofetch.raw(url).then((res) => res.headers);
  return headers.get("x-typescript-types");
}
