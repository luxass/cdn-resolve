import { parsePackage } from "./utils";

export type UnpkgOptions = {
  module?: boolean
  meta?: boolean
};

export function resolveUnpkg(
  module: string,
  options?: UnpkgOptions
): URL | undefined {
  try {
    const pkg = parsePackage(module);

    const url = new URL(pkg.full, "https://unpkg.com");

    if (options?.meta) {
      url.searchParams.set("meta", "true");
    }

    if (options?.module) {
      url.searchParams.set("module", "true");
    }

    return url;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
