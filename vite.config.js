import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The pre-existing AI Savings Assistant widget ships as a .js file
  // containing JSX (written for a CRA-style toolchain). Vite/esbuild only
  // apply the JSX loader to .jsx/.tsx by default, so widen it to .js too
  // rather than renaming a file the conversion plan keeps untouched.
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
