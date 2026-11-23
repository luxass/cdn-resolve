import { describe, expect, it } from "vitest";

import { parsePackage } from "../src/parse";

describe("packages with scopes", () => {
  it("without version and path", () => {
    const parsed = parsePackage("@babel/core");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "latest",
      full: "@babel/core@latest",
    });
  });

  it("with version and path", () => {
    const parsed = parsePackage("@babel/core@7.21.3/lib/parse.js");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "7.21.3",
      path: "/lib/parse.js",
      full: "@babel/core@7.21.3/lib/parse.js",
    });
  });

  it("with version and without path", () => {
    const parsed = parsePackage("@babel/core@7.21.3");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "7.21.3",
      full: "@babel/core@7.21.3",
    });
  });

  it("without version and with path", () => {
    const parsed = parsePackage("@babel/core/lib/parse.js");

    expect(parsed).toEqual({
      scope: "babel",
      name: "@babel/core",
      version: "latest",
      path: "/lib/parse.js",
      full: "@babel/core@latest/lib/parse.js",
    });
  });
});

describe("packages without scopes", () => {
  it("without version and path", () => {
    const parsed = parsePackage("react");

    expect(parsed).toEqual({
      name: "react",
      version: "latest",
      full: "react@latest",
    });
  });

  it("with version and path", () => {
    const parsed = parsePackage("react@18.2.0/package.json");

    expect(parsed).toEqual({
      name: "react",
      version: "18.2.0",
      path: "/package.json",
      full: "react@18.2.0/package.json",
    });
  });

  it("with version and without path", () => {
    const parsed = parsePackage("react@18.2.0");

    expect(parsed).toEqual({
      name: "react",
      version: "18.2.0",
      full: "react@18.2.0",
    });
  });

  it("without version and with path", () => {
    const parsed = parsePackage("react/package.json");

    expect(parsed).toEqual({
      name: "react",
      version: "latest",
      path: "/package.json",
      full: "react@latest/package.json",
    });
  });
});

it("throw error when package name is invalid", () => {
  expect(() => parsePackage("@babel")).toThrowError("Invalid package name: @babel");
});

it.each([
  "react?dev",
  "react#top",
  "javascript:alert(1)",
  "http:evil.example",
  "re act",
  "re%61ct",
  "@sc ope/name",
  "@scope/na:me",
  "@sc@ope/name",
])("rejects the name %j because npm requires URL-safe names", (specifier) => {
  expect(() => parsePackage(specifier)).toThrowError(`Invalid package name: ${specifier}`);
});
