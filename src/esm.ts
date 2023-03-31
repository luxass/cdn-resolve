import { parsePackage } from "./utils";

/**
 * https://esm.sh/#docs
 */
export interface ESMOptions {
  deps?: string[];

  /**
   * A list of dependencies to externalize
   * if true, all dependencies will be externalized
   */
  external?: string[] | boolean;

  pin?: string;
  esbuild?: {
    target?: "es2015" | "es2022" | "esnext" | "deno" | "denonext";
    keepNames?: boolean;
    ignoreAnnotations?: boolean;
  };
  /**
   * A list of modules to alias to other modules
   */
  alias?: Record<string, string>;
  /**
   * To enable tree shaking, you need to specify the list of exports to keep
   */
  treeShake?: string[];
  /**
   * Bundle
   */
  bundle?: boolean;

  /**
   * Development Mode
   */
  dev?: boolean;

  /**
   * Worker Mode
   */
  worker?: boolean;

  cjsExports?: string[];

  noDts?: boolean;
}

export function resolveESM(module: string, options?: ESMOptions) {
  try {
    const pkg = parsePackage(module);

    const url = new URL(
      `${options?.external === true ? "*" : ""}${pkg.full}`,
      "https://esm.sh"
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
          .join(",")
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
export async function resolveESMTypes(url: URL | string) {
  if (typeof url === "string") {
    url = new URL(url);
  }

  const headers = await fetch(url).then((res) => res.headers);

  return headers.get("x-typescript-types");
}
