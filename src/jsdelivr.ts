import { parsePackage } from "./utils";

export function resolveJSDelivr(module: string) {
  try {
    const pkg = parsePackage(module);

    const url = new URL(pkg.full, "https://cdn.jsdelivr.net/npm");

    return url;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
