export interface ParsedPackage {
  name: string;
  version: string;
  path?: string;
  scope?: string;
}

export function parsePackage(pkg: string): ParsedPackage {
  const matched =
    /^(@(?<scope>[^\/]+)\/(?<name>[^@\/]+))(?:@(?<version>[^\/]+))?(?<path>\/.*)?$/.exec(
      pkg
    ) || /^(?<name>[^@\/]+)(?:@(?<version>[^\/]+))?(?<path>\/.*)?$/.exec(pkg);

  if (!matched || !matched.groups?.name) {
    throw new Error(`Invalid package name: ${pkg}`);
  }

  return {
    name: matched.groups.name,
    version: matched.groups?.version || "latest",
    path: matched.groups?.path,
    scope: matched.groups?.scope
  };
}
