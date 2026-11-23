export interface ParsedPackage {
  name: string;
  version: string;
  path?: string;
  scope?: string;
  full: string;
}

const PACKAGE_SPECIFIER =
  /^(?:@(?<scope>[^/]+)\/)?(?<name>[^@/]+)(?:@(?<version>[^/]+))?(?<path>\/.*)?$/u;

/**
 * Parses a package string and returns the parsed package information.
 * @param {string} pkg The package string to parse.
 * @returns The parsed package information.
 * @throws Error if the package name is invalid.
 *
 * NOTE:
 * The version is always set to "latest" if not specified.
 */
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
