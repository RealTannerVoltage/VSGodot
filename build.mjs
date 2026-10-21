import { build } from "esbuild";

await Promise.all([
  build({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    platform: "node",
    format: "cjs",
    external: ["vscode"],
    outfile: "dist/extension.js"
  }),
  build({
    entryPoints: ["src/browser.ts"],
    bundle: true,
    platform: "browser",
    format: "cjs",
    external: ["vscode"],
    outfile: "dist/browser.js"
  })
]);