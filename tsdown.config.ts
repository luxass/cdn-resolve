import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/esm.ts",
    "./src/jsdelivr.ts",
    "./src/parse.ts",
    "./src/unpkg.ts",
  ],
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  treeshake: true,
  exports: true,
  publint: true,
});
