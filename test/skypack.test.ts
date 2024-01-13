import { expect, it } from "vitest";

import { resolveSkypack, resolveSkypackHeaders } from "../src/skypack";

it("resolve react", () => {
  const resolved = resolveSkypack("react");

  expect(resolved?.host).toBe("cdn.skypack.dev");
  expect(resolved?.pathname).toBe("/react@latest");
});

it("resolve react@17", () => {
  const resolved = resolveSkypack("react@17");

  expect(resolved?.host).toBe("cdn.skypack.dev");
  expect(resolved?.pathname).toBe("/react@17");
});

it("resolve preact types without header", async () => {
  const url = resolveSkypack("preact@10.5.5");
  const resolved = await resolveSkypackHeaders(url!);

  expect(resolved.pinnedUrl).toBe(
    "https://cdn.skypack.dev/pin/preact@v10.5.5-PqUUDAM9QPWYYL2uxjUu/mode=imports/optimized/preact.js",
  );
  expect(resolved.importUrl).toBe(
    "https://cdn.skypack.dev/-/preact@v10.5.5-PqUUDAM9QPWYYL2uxjUu/dist=es2019,mode=imports/optimized/preact.js",
  );
});

it("resolve vue types with header", async () => {
  const url = resolveSkypack("preact@10.5.5", {
    dts: true,
  });

  const resolved = await resolveSkypackHeaders(url!);

  expect(resolved.typesUrl).toBe(
    "https://cdn.skypack.dev/-/preact@v10.5.5-PqUUDAM9QPWYYL2uxjUu/dist=es2019,mode=types/src/index.d.ts",
  );
  expect(resolved.pinnedUrl).toBe(
    "https://cdn.skypack.dev/pin/preact@v10.5.5-PqUUDAM9QPWYYL2uxjUu/mode=imports/optimized/preact.js",
  );
  expect(resolved.importUrl).toBe(
    "https://cdn.skypack.dev/-/preact@v10.5.5-PqUUDAM9QPWYYL2uxjUu/dist=es2019,mode=imports/optimized/preact.js",
  );
});
