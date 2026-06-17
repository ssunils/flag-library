import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Pages the site is served from https://<user>.github.io/flaglet/,
// so production builds need the repo name as the base path. Local dev stays at
// "/". If you name the repo something other than "flaglet", update this.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/flaglet/" : "/",
  plugins: [react()],
  server: { port: 5180 },
  // flaglet is linked via file:..; don't pre-bundle it so the exports map and
  // lazy chunk splitting are exercised exactly as a published consumer would.
  optimizeDeps: { exclude: ["flaglet"] },
}));
