import { parsePackage } from "./parse";

export const CDN_BASE_URLS = {
  esm: "https://esm.sh",
  unpkg: "https://unpkg.com",
  jsdelivr: "https://cdn.jsdelivr.net/npm",
} as const;

/** The UNPKG host that converts npm packages into browser-ready ES modules. */
export const UNPKG_ESM_BASE_URL = "https://esm.unpkg.com";

type ECMAScriptYear = 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024;

/** An ECMAScript output target from `es2015` to `es2024`. */
export type ECMAScriptTarget = `es${ECMAScriptYear}`;

/**
 * Resolves a path against a CDN base URL.
 *
 * The path is relative, so `resolveCdnUrl("https://esm.sh", "jsr/@std/path")`
 * returns `https://esm.sh/jsr/@std/path`.
 */
export function resolveCdnUrl(baseUrl: string, path: string): URL {
  return new URL(path, `${baseUrl}/`);
}

/**
 * Builds a CDN URL from a package specifier.
 *
 * The specifier always gets an explicit version, so `react` becomes
 * `react@latest`. The optional prefix goes before the package name, for
 * example `*` for esm.sh's external dependencies.
 *
 * @throws Error if the package name is invalid.
 */
export function createCdnPackageUrl(
  cdn: keyof typeof CDN_BASE_URLS,
  specifier: string,
  prefix = "",
): URL {
  const { full } = parsePackage(specifier);
  return resolveCdnUrl(CDN_BASE_URLS[cdn], prefix + full);
}

/**
 * Appends a query flag when it is enabled.
 *
 * esm.sh accepts `?dev=true`. esm.unpkg.com redirects flags to the empty form,
 * `?dev=`, so its builder passes an empty value.
 */
export function appendQueryFlag(
  params: URLSearchParams,
  key: string,
  enabled: boolean | undefined,
  value = "true",
): void {
  if (enabled) params.append(key, value);
}

/**
 * Appends a comma-separated query list. Empty lists add nothing.
 */
export function appendQueryList(params: URLSearchParams, key: string, values?: string[]): void {
  if (values?.length) params.append(key, values.join(","));
}

/**
 * Formats dependency aliases as `from:to` pairs, such as `react:preact/compat`.
 */
export function formatQueryAliases(aliases?: Record<string, string>): string[] | undefined {
  return aliases && Object.entries(aliases).map(([from, to]) => `${from}:${to}`);
}
