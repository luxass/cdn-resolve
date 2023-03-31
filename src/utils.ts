export interface ParsedPackage {
  name: string;
  version: string;
  path?: string;
  scope?: string;
  full: string;
}

export function parsePackage(pkg: string): ParsedPackage {
  const matched =
    /^(@(?<scope>[^\/]+)\/(?<name>[^@\/]+))(?:@(?<version>[^\/]+))?(?<path>\/.*)?$/.exec(
      pkg
    ) || /^(?<name>[^@\/]+)(?:@(?<version>[^\/]+))?(?<path>\/.*)?$/.exec(pkg);

  if (!matched || !matched.groups?.name) {
    throw new Error(`Invalid package name: ${pkg}`);
  }

  const name = matched.groups.name;
  const version = matched.groups?.version || "latest";
  const path = matched.groups?.path;
  const scope = matched.groups?.scope;

  const full = scope ?
    `@${scope}/${name}@${version}${path || ""}` :
    `${name}@${version}${path || ""}`;

  return {
    name,
    version,
    path,
    scope,
    full
  };
}
