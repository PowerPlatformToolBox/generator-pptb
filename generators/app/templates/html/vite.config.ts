import { defineConfig } from "vite";

export default defineConfig((configEnv) => {
  return {
    base: "./src",
    root: "./src",
    build: {
      outDir: "../dist",
      assetsDir: "assets",
      cssCodeSplit: false,
      sourcemap: configEnv.mode === "development",
      rollupOptions: {
        output: {
          // Use IIFE format for compatibility with iframe srcdoc loading
          // ES modules can have issues when loaded via file:// URLs in iframes
          format: "iife",
          // Bundle everything into a single file to avoid module loading issues
          inlineDynamicImports: true,
          // Disable chunking since we're bundling everything
          manualChunks: undefined,
        },
      },
    },
  };
});
