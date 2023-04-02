import { describe, expect, test } from "vitest";

import {
  parsePackage,
  resolveCDN,
  resolveESM,
  resolveJSDelivr,
  resolveSkypack,
  resolveUnpkg
} from "../src";

describe("packages with scopes", () => {
  test("without version and path", () => {
    const parsed = parsePackage("@babel/core");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "latest",
      full: "@babel/core@latest"
    });
  });

  test("with version and path", () => {
    const parsed = parsePackage("@babel/core@7.21.3/lib/parse.js");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "7.21.3",
      path: "/lib/parse.js",
      full: "@babel/core@7.21.3/lib/parse.js"
    });
  });

  test("with version and without path", () => {
    const parsed = parsePackage("@babel/core@7.21.3");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "7.21.3",
      full: "@babel/core@7.21.3"
    });
  });

  test("without version and with path", () => {
    const parsed = parsePackage("@babel/core/lib/parse.js");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "latest",
      path: "/lib/parse.js",
      full: "@babel/core@latest/lib/parse.js"
    });
  });
});

describe("packages without scopes", () => {
  test("without version and path", () => {
    const parsed = parsePackage("react");

    expect(parsed).toEqual({
      name: "react",
      version: "latest",
      full: "react@latest"
    });
  });

  test("with version and path", () => {
    const parsed = parsePackage("react@18.2.0/package.json");

    expect(parsed).toEqual({
      name: "react",
      version: "18.2.0",
      path: "/package.json",
      full: "react@18.2.0/package.json"
    });
  });

  test("with version and without path", () => {
    const parsed = parsePackage("react@18.2.0");

    expect(parsed).toEqual({
      name: "react",
      version: "18.2.0",
      full: "react@18.2.0"
    });
  });

  test("without version and with path", () => {
    const parsed = parsePackage("react/package.json");

    expect(parsed).toEqual({
      name: "react",
      version: "latest",
      path: "/package.json",
      full: "react@latest/package.json"
    });
  });
});

test("throw error when package name is invalid", () => {
  expect(() => parsePackage("@babel")).toThrowError(
    "Invalid package name: @babel"
  );
});

test("resolve cdn from string", () => {
  expect(resolveCDN("skypack")).toBe(resolveSkypack);
  expect(resolveCDN("esm")).toBe(resolveESM);
  expect(resolveCDN("unpkg")).toBe(resolveUnpkg);
  expect(resolveCDN("jsdelivr")).toBe(resolveJSDelivr);
});
