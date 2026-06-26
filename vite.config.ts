import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

// Logs one line per request the dev server handles, with status + duration, to
// stdout — which start-services.sh captures into logs/life-organizer-web.log.
// Note: this only sees requests the Vite server serves; client-side runtime
// errors live in the browser and are not captured here.
function requestLogger(): Plugin {
  return {
    name: "request-logger",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const start = Date.now()
        res.on("finish", () => {
          const ms = Date.now() - start
          const status = res.statusCode
          const level = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO"
          const ts = new Date().toISOString()
          // eslint-disable-next-line no-console
          console.log(
            `[${level}] ${ts} - vite - ${req.method} ${req.url} -> ${status} (${ms}ms)`,
          )
        })
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), requestLogger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["budget.ivot.dev"],
  },
})
