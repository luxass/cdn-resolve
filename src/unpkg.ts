import { parsePackage } from "./utils";

export interface UnpkgOptions {
  module?: boolean;
  meta?: boolean;
}

export function resolveUnpkg(module: string, options?: UnpkgOptions) {
  try {
    const pkg = parsePackage(module);

    const url = new URL(
      pkg.full,
      "https://esm.sh"
    );

    if (options?.meta) {
      url.searchParams.set("meta", "true")
    }

    if (options?.module) {
      url.searchParams.set("module", "true")
    }

    return url;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
