# cdn-resolve

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Resolves packages to their relative CDN URLS.

> [!NOTE]
> Skypack was recently removed in version v2.0.0, since it wa unmainted and new code was breaking it.
> So if you are using Skypack, please use version v1.4.1

## Features

- Resolves a package name to a CDN URL
- Supports all major CDNs (esm.sh, unpkg, jsdelivr, etc.)
- Resolves types

## 📦 Installation

```sh
npm install cdn-resolve
```

## 📚 Usage

Resolve React from [esm.sh](https://esm.sh)

```js
import { buildCDNUrl } from "cdn-resolve";

// You can also import the esm builder directly
import { buildESMUrl } from "cdn-resolve/esm";

const esm = buildCDNUrl("esm");

esm("swr", {
  alias: {
    react: "preact/compat"
  }
});
// => https://esm.sh/swr?alias=react:preact/compat

buildESMUrl("swr", {
  alias: {
    react: "preact/compat"
  }
});

// => https://esm.sh/swr?alias=react:preact/compat
```

Resolve typedefs for React from [esm.sh](https://esm.sh)

```js
import { buildESMUrl } from "cdn-resolve/esm";

const resolved = buildESMUrl("swr@2.1.1", {
  alias: {
    react: "preact/compat"
  }
});

const typesUrl = await resolveESMTypes(resolved);

// => https://esm.sh/v135/swr@2.1.1/X-YS9yZWFjdDpwcmVhY3QvY29tcGF0/core/dist/index.d.ts
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

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/cdn-resolve?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/cdn-resolve
[npm-downloads-src]: https://img.shields.io/npm/dm/cdn-resolve?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/cdn-resolve
