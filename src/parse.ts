export interface ParsedPackage {
  name: string;
  version: string;
  path?: string;
  scope?: string;
  full: string;
}

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
  const matched =
    /^(@(?<scope>[^\/]+)\/(?<name>[^@\/]+))(?:@(?<version>[^\/]+))?(?<path>\/.*)?$/.exec(
      pkg,
    ) || /^(?<name>[^@\/]+)(?:@(?<version>[^\/]+))?(?<path>\/.*)?$/.exec(pkg);

  if (!matched || !matched.groups?.name) {
    throw new Error(`Invalid package name: ${pkg}`);
  }

  const version = matched.groups?.version || "latest";
  const path = matched.groups?.path;
  const scope = matched.groups?.scope;
  const name = scope ? `@${scope}/${matched.groups.name}` : matched.groups.name;

  return {
    name,
    version,
    path,
    scope,
    full: `${name}@${version}${path || ""}`,
  };
}
