import { createCdnPackageUrl } from "./cdn-url";

/** Builds a jsDelivr npm URL. Append /+esm to the specifier for browser ESM. */
export function buildJSDelivrUrl(module: string): URL | undefined {
  try {
    return createCdnPackageUrl("jsdelivr", module);
  } catch {
    return undefined;
  }
}
