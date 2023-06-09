export type ParsedPackage = {
  name: string
  version: string
  path?: string
  scope?: string
  full: string
};

export function parsePackage(pkg: string): ParsedPackage {
  const matched =
    /^(@(?<scope>[^\/]+)\/(?<name>[^@\/]+))(?:@(?<version>[^\/]+))?(?<path>\/.*)?$/.exec(
      pkg
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
    full: `${name}@${version}${path || ""}`
  };
}
