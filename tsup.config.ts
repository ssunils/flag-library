import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "flags/index": "src/flags/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  sourcemap: true,
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
  external: ["react", "react-dom"],
});
