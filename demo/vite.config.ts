import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Pages the site is served from https://<user>.github.io/<repo>/,
// so production builds need the repo name as the base path. The repo is named
// "flag-library", so the base must match. Local dev stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/flag-library/" : "/",
  plugins: [react()],
  server: { port: 5180 },
  // react-flaglet is linked via file:..; don't pre-bundle it so the exports map
  // and lazy chunk splitting are exercised exactly as a published consumer would.
  optimizeDeps: { exclude: ["react-flaglet"] },
}));
