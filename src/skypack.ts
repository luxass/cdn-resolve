import { parsePackage } from "./utils";

export interface SkypackOptions {
  min?: boolean;
  dts?: boolean;
}

export async function resolveSkypack(module: string, options?: SkypackOptions) {
  try {
    const pkg = parsePackage(module);

    const url = new URL(pkg.full, "https://cdn.skypack.dev/");

    if (options?.dts) {
      url.searchParams.set("dts", "true")
    }

    if (options?.min) {
      url.searchParams.set("min", "true")
    }
    return url;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
