import { expect, it } from "vitest";

import {
  buildCDNUrl,
  buildESMUrl,
  buildJSDelivrUrl,
  buildSkypackUrl,
  buildUnpkgUrl,
} from "../src";

it("resolve cdn from string", () => {
  expect(buildCDNUrl("skypack")).toBe(buildSkypackUrl);
  expect(buildCDNUrl("esm")).toBe(buildESMUrl);
  expect(buildCDNUrl("unpkg")).toBe(buildUnpkgUrl);
  expect(buildCDNUrl("jsdelivr")).toBe(buildJSDelivrUrl);
});
