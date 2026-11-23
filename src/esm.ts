import { createCdnPackageUrl } from "./cdn-url";

type ECMAScriptYear = 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024;
type ESMTarget = `es${ECMAScriptYear}` | "esnext" | "deno" | "denonext" | "node";

/** Build options for esm.sh. */
export interface ESMOptions {
  /** Overrides dependency versions, for example `['react@18.3.1']`. */
  deps?: string[];
  /** Replaces dependencies, for example `{ react: 'preact/compat' }`. */
  alias?: Record<string, string>;
  /** Keeps only the named exports in the build. */
  treeShake?: string[];
  /** `bundle-deps` bundles dependencies except peers. `no-bundle` disables bundling. */
  bundle?: "bundle-deps" | "no-bundle";
  /** Selects the development build. */
  dev?: boolean;
  /** Overrides options that esm.sh passes to its builder. */
  esbuild?: {
    /** Selects the output target instead of using the request's user agent. */
    target?: ESMTarget;
    /** Adds custom conditions for resolving package exports. */
    conditions?: string[];
    /** Preserves function and class names when minifying. */
    keepNames?: boolean;
    /** Ignores purity annotations when optimizing the build. */
    ignoreAnnotations?: boolean;
  };
  /** Returns a factory for a web worker. */
  worker?: boolean;
  /** Returns the CSS imported by the package's JavaScript. */
  css?: boolean;
  /** Wraps a `.wasm` file in a JavaScript module. */
  wasm?: boolean;
  /** Leaves the named dependencies as bare imports, or all dependencies if `true`. */
  external?: string[] | boolean;
  /** Sends a legacy esm.sh build version. This does not guarantee an immutable build. */
  pin?: string;
  /** Omits the `X-TypeScript-Types` header. */
  noDts?: boolean;
  /** Returns the published file without transforming it into an ES module. */
  raw?: boolean;
}

function appendFlag(params: URLSearchParams, key: string, enabled?: boolean): void {
  if (enabled) params.append(key, "true");
}

function appendList(params: URLSearchParams, key: string, values?: string[]): void {
  if (values) params.append(key, values.join(","));
}

/** Builds an esm.sh URL, or returns undefined if it cannot build one. */
export function buildESMUrl(module: string, options?: ESMOptions): URL | undefined {
  try {
    const url = createCdnPackageUrl("esm", module, options?.external === true ? "*" : "");
    if (!options) return url;

    const params = url.searchParams;
    appendList(params, "deps", options.deps);
    if (options.alias) {
      const aliases = Object.entries(options.alias).map(([from, to]) => `${from}:${to}`);
      appendList(params, "alias", aliases);
    }
    appendList(params, "exports", options.treeShake);

    if (options.bundle === "bundle-deps") {
      params.append("standalone", "true");
    } else if (options.bundle === "no-bundle") {
      params.append("bundle", "false");
    }
    appendFlag(params, "dev", options.dev);

    const { esbuild } = options;
    if (esbuild?.target) params.append("target", esbuild.target);
    appendList(params, "conditions", esbuild?.conditions);
    appendFlag(params, "keep-names", esbuild?.keepNames);
    appendFlag(params, "ignore-annotations", esbuild?.ignoreAnnotations);

    appendFlag(params, "worker", options.worker);
    appendFlag(params, "css", options.css);
    appendFlag(params, "module", options.wasm);
    if (Array.isArray(options.external)) appendList(params, "external", options.external);
    if (options.pin) params.append("pin", options.pin);
    appendFlag(params, "no-dts", options.noDts);
    appendFlag(params, "raw", options.raw);
    return url;
  } catch {
    return undefined;
  }
}

/** Reads esm.sh's type declaration URL, or returns null if the header is absent. */
export async function resolveESMTypes(url: URL | string): Promise<string | null> {
  const response = await fetch(url instanceof URL ? url.toString() : url);
  return response.headers.get("x-typescript-types");
}
