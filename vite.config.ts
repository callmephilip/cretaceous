import path from "node:path";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import build from "@hono/vite-build/deno";
import preserveDirectives from 'rollup-preserve-directives'

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
       plugins: [
        preserveDirectives(),
      ],
      esbuild: {
        jsxImportSource: "hono/jsx/dom", // Optimized for hono/jsx/dom
      },
      build: {
        rollupOptions: {
          input: "./client/index.tsx",
          output: {
            entryFileNames: "static/client.js",
          },
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./client"),
        },
      },
    };
  }

  return {
    plugins: [
      deno(),
      build({
        entry: "server/app.tsx",
      }),
      devServer({
        entry: "server/app.tsx",
      }),
    ],
  };
});
