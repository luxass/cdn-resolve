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
      url.searchParams.set("dts", "true");
    }

    if (options?.min) {
      url.searchParams.set("min", "true");
    }
    return url;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export interface SkypackHeaders {
  typesUrl?: string;
  pinnedUrl?: string;
  importUrl?: string
}

export async function resolveSkypackHeaders(url: URL | string): Promise<SkypackHeaders> {
  if (typeof url === "string") {
    url = new URL(url);
  }

  const headers = await fetch(url).then((res) => res.headers);

  return {
    typesUrl: headers.has("x-typescript-types") ? `https://cdn.skypack.dev${headers.get("x-typescript-types")}` : undefined,
    pinnedUrl: headers.has("x-pinned-url") ? `https://cdn.skypack.dev${headers.get("x-pinned-url")}` : undefined,
    importUrl: headers.has("x-import-url") ? `https://cdn.skypack.dev${headers.get("x-import-url")}` : undefined
  };
}
