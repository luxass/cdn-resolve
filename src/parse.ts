export interface ParsedPackage {
  name: string;
  version: string;
  path?: string;
  scope?: string;
  full: string;
}

const PACKAGE_SPECIFIER =
  /^(?:@(?<scope>[^/]+)\/)?(?<name>[^@/]+)(?:@(?<version>[^/]+))?(?<path>\/.*)?$/u;

/** Parses an npm specifier, defaulting an omitted version to "latest". */
export function parsePackage(pkg: string): ParsedPackage {
  const parts = PACKAGE_SPECIFIER.exec(pkg)?.groups;
  if (!parts?.name) {
    throw new Error(`Invalid package name: ${pkg}`);
  }

  const { version = "latest", path, scope } = parts;
  const name = scope ? `@${scope}/${parts.name}` : parts.name;

  return {
    name,
    version,
    path,
    scope,
    full: `${name}@${version}${path || ""}`,
  };
}
