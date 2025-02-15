import { expect, it } from "vitest";

import { buildESMUrl, resolveESMTypes } from "../src/esm";

it("should return a URL for a module without options", () => {
  const url = buildESMUrl("react");
  expect(url?.toString()).toBe("https://esm.sh/react@latest");
});

it("should return a URL for a module with external option", () => {
  const url = buildESMUrl("react", { external: true });
  expect(url?.toString()).toBe("https://esm.sh/*react@latest");
});

it("should return a URL for a module with deps option", () => {
  const url = buildESMUrl("react", { deps: ["react-dom"] });
  expect(url?.searchParams.get("deps")).toBe("react-dom");
});

it("should return a URL for a module with alias option", () => {
  const url = buildESMUrl("react", { alias: { "react-dom": "preact" } });
  expect(url?.searchParams.get("alias")).toBe("react-dom:preact");
});

it("should return a URL for a module with treeShake option", () => {
  const url = buildESMUrl("react", { treeShake: ["default"] });
  expect(url?.searchParams.get("exports")).toBe("default");
});

it("should return a URL for a module with bundle-deps option", () => {
  const url = buildESMUrl("react", { bundle: "bundle-deps" });
  expect(url?.searchParams.get("bundle")).toBe("bundle-deps");
});

it("should return a URL for a module with no-bundle option", () => {
  const url = buildESMUrl("react", { bundle: "no-bundle" });
  expect(url?.searchParams.get("bundle")).toBe("no-bundle");
});

it("should return a URL for a module with dev option", () => {
  const url = buildESMUrl("react", { dev: true });
  expect(url?.searchParams.get("dev")).toBe("true");
});

it("should return a URL for a module with esbuild target option", () => {
  const url = buildESMUrl("react", { esbuild: { target: "es2022" } });
  expect(url?.searchParams.get("target")).toBe("es2022");
});

it("should return a URL for a module with esbuild conditions option", () => {
  const url = buildESMUrl("react", { esbuild: { conditions: ["custom1", "custom2"] } });
  expect(url?.searchParams.get("conditions")).toBe("custom1,custom2");
});

it("should return a URL for a module with esbuild keepNames option", () => {
  const url = buildESMUrl("react", { esbuild: { keepNames: true } });
  expect(url?.searchParams.get("keep-names")).toBe("true");
});

it("should return a URL for a module with esbuild ignoreAnnotations option", () => {
  const url = buildESMUrl("react", { esbuild: { ignoreAnnotations: true } });
  expect(url?.searchParams.get("ignore-annotations")).toBe("true");
});

it("should return a URL for a module with worker option", () => {
  const url = buildESMUrl("react", { worker: true });
  expect(url?.searchParams.get("worker")).toBe("true");
});

it("should return typescript types from headers when URL is a string", async () => {
  const types = await resolveESMTypes("https://esm.sh/react@18.3.0");
  expect(types).not.toBeNull();

  const url = new URL(types!);

  expect(url.hostname).toBe("esm.sh");
  expect(url.pathname).toMatch(/^\/@types\/react@~18\.3\.\d+\/index\.d\.ts$/);
});

it("should return typescript types from headers when URL is a URL object", async () => {
  const types = await resolveESMTypes(new URL("https://esm.sh/react@18.2.0"));

  const url = new URL(types!);

  expect(url.hostname).toBe("esm.sh");
  expect(url.pathname).toMatch(/^\/@types\/react@~18\.2\.\d+\/index\.d\.ts$/);
});

it("should return null when x-typescript-types header is not present", async () => {
  const types = await resolveESMTypes("https://esm.sh/non-existent-module");
  expect(types).toBeNull();
});
