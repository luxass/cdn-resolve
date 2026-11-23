import { createCdnPackageUrl } from "./cdn-url";

export interface UnpkgOptions {
  /** Asks UNPKG for the package's module entry, without transpiling it. */
  module?: boolean;
  /** Lists the published files at this path. */
  meta?: boolean;
  /** Selects custom conditions from the package's exports. */
  conditions?: string[];
}

/** Builds an UNPKG URL for a published npm file or package entry. */
export function buildUnpkgUrl(module: string, options?: UnpkgOptions): URL | undefined {
  try {
    const url = createCdnPackageUrl("unpkg", module);
    if (options?.meta) {
      url.searchParams.set("meta", "true");
    }
    if (options?.module) {
      url.searchParams.set("module", "true");
    }
    if (options?.conditions?.length) {
      url.searchParams.set("conditions", options.conditions.join(","));
    }
    return url;
  } catch {
    return undefined;
  }
}
