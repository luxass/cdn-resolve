# cdn-resolve

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Build URLs for npm packages on esm.sh, UNPKG, and jsDelivr. The library supports Node.js 22 and later and has no runtime dependencies.

```sh
npm install cdn-resolve
```

## Build a URL

Pass a package name, an optional version or tag, and an optional subpath. The builders use `latest` when you omit the version. They return a `URL` or `undefined` if the URL cannot be built.

```js
import { buildCDNUrl, buildJSDelivrUrl, buildUnpkgUrl } from "cdn-resolve";

const esm = buildCDNUrl("esm");
const react = esm("react@19", { bundle: "no-bundle" });
// https://esm.sh/react@19?bundle=false

const server = buildUnpkgUrl("react@19", { conditions: ["react-server"] });
// https://unpkg.com/react@19?conditions=react-server

const hooks = buildJSDelivrUrl("preact@10.26.4/hooks", { esm: true });
// https://cdn.jsdelivr.net/npm/preact@10.26.4/hooks/+esm
```

- [esm.sh](https://github.com/esm-dev/esm.sh#bundling-strategy) transforms packages for ES module imports. `bundle-deps` requests a standalone build, which bundles dependencies other than peer dependencies. `no-bundle` disables bundling.
- [UNPKG](https://unpkg.com/guides/loading-files) serves published files. Use `conditions` to select package exports or `meta` to list files. Set `esm` to build browser-ready ES modules on esm.unpkg.com. The `module` option is deprecated because UNPKG no longer documents it.
- [jsDelivr](https://www.jsdelivr.com/esm) serves published files by default. Set `esm: true` to add `/+esm` for a browser-ready ES module of the package or subpath.

## Load JSR and GitHub packages from esm.sh

[esm.sh](https://github.com/esm-dev/esm.sh#supported-registries) also serves packages from JSR and GitHub. Set `registry` to `jsr` for a scoped JSR package, or to `github` for `owner/repo`. Without a tag, branch, or commit, esm.sh uses the repository's default branch.

```js
import { buildESMUrl } from "cdn-resolve/esm";

buildESMUrl("@std/encoding@1.0.0/base64", { registry: "jsr" });
// https://esm.sh/jsr/@std/encoding@1.0.0/base64

buildESMUrl("microsoft/tslib@v2.8.0", { registry: "github" });
// https://esm.sh/gh/microsoft/tslib@v2.8.0
```

## Build browser modules with esm.unpkg.com

[esm.unpkg.com](https://unpkg.com/guides/browser-modules) converts npm packages into ES modules that browsers can load directly. Set `esm` to `true` for the default build, or pass build options. The builder writes the canonical URL that esm.unpkg.com would otherwise redirect to.

```js
import { buildUnpkgUrl } from "cdn-resolve/unpkg";

buildUnpkgUrl("react@19.2.0", { esm: true });
// https://esm.unpkg.com/react@19.2.0

buildUnpkgUrl("react-dom@19.2.0/client", {
  esm: { deps: ["react@19.2.0"], target: "es2020" },
});
// https://esm.unpkg.com/react-dom@19.2.0/client?deps=react%4019.2.0&target=es2020
```

## Find type declarations on esm.sh

`resolveESMTypes` reads the `X-TypeScript-Types` header. It returns `null` if the header is absent and rejects if `fetch` fails.

```js
import { buildESMUrl, resolveESMTypes } from "cdn-resolve/esm";

const react = buildESMUrl("react@19");
if (react) {
  const typesUrl = await resolveESMTypes(react);
  console.log(typesUrl);
}
```

## Parse a package specifier

`parsePackage` keeps the leading slash on the subpath. It throws if it cannot parse the input.

```js
import { parsePackage } from "cdn-resolve/parse";

const parsed = parsePackage("@babel/core/lib/parse.js");
// {
//   name: "@babel/core",
//   version: "latest",
//   path: "/lib/parse.js",
//   scope: "babel",
//   full: "@babel/core@latest/lib/parse.js"
// }
```

## License

[MIT](./LICENSE)

[npm-version-src]: https://img.shields.io/npm/v/cdn-resolve?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/cdn-resolve
[npm-downloads-src]: https://img.shields.io/npm/dm/cdn-resolve?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/cdn-resolve
