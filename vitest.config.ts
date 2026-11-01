import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  // Tests use the client defaults, whatever the local .env points at.
  envDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    exclude: ["**/node_modules/**", "**/trees/**"],
  },
})
