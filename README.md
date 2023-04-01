# cdn-resolve

[![npm version][npm-version-src]][npm-version-href]

> Resolves packages to their relative CDN URLS.

## Features

- Resolves a package name to a CDN URL
- Supports all major CDNs (esm.sh, skypack, unpkg, jsdelivr, etc.)
- Resolves types

## 📦 Installation

```sh
pnpm install cdn-resolve
```

## 📚 Usage

Resolve React from [esm.sh](https://esm.sh)

```js
import { resolveCDN } from "cdn-resolve";
// You can also import the esm resolver directly
import { resolveESM } from "cdn-resolve/esm";

const resolver = resolveESM("esm");

resolver("swr", {
  alias: {
    react: "preact/compat"
  }
});

// => https://esm.sh/swr?alias=react:preact/compat

resolveESM("swr", {
  alias: {
    react: "preact/compat"
  }
});

// => https://esm.sh/swr?alias=react:preact/compat
```

Resolve typedefs for React from [esm.sh](https://esm.sh)

```js
import { resolveESM, resolveESMTypes } from "cdn-resolve/esm";

const resolved = resolveESM("swr@2.1.1", {
  alias: {
    react: "preact/compat"
  }
});

const typesUrl = await resolveESMTypes(resolved);

// => https://esm.sh/v113/swr@2.1.1/X-YS9yZWFjdDpwcmVhY3QvY29tcGF0/core/dist/index.d.ts
```

Parse a Package Name

```js
import { parsePackage } from "cdn-resolve";

const parsed = parsePackage("vue");

// => {
//   "name": "vue",
//   "version": "latest",
// }

const parsedWithVersion = parsePackage("vue@3.2.47");

// => {
//   "name": "vue",
//   "version": "3.2.47",
// }

const parsedWithPathAndVersion = parsePackage("vue@3.2.47/package.json");

// => {
//   "name": "vue",
//   "version": "3.2.47",
//   "path": "package.json"
// }
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Run tests using `pnpm dev`

## License

Made with ❤️

Published under [MIT License](./LICENCE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/cdn-resolve?style=flat-square
[npm-version-href]: https://npmjs.com/package/cdn-resolve
