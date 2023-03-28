import { test } from "vitest";

import { resolveSkypack } from "../src/skypack";

test("resolve react with a pinned url", async () => {
  const reactUrl = await resolveSkypack("react", {
    pin: true
  });

  
});
