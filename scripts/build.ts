import * as esbuild from "npm:esbuild@0.20.2";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.10.3";

declare const Deno: any;

// Ensure dist directory exists
try {
  await Deno.mkdir("dist", { recursive: true });
} catch {}

console.log("Building...");

try {
  await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./index.tsx"],
    outfile: "./dist/bundle.js",
    bundle: true,
    format: "esm",
    target: "esnext",
    minify: true,
    keepNames: true,
    external: [
      "@angular/*",
      "@google/*",
      "rxjs",
      "rxjs/*"
    ]
  });

  console.log("Bundle created.");

  // Process HTML
  let html = await Deno.readTextFile("index.html");
  // Replace the typescript entry point with the bundled javascript
  html = html.replace('src="./index.tsx"', 'src="./bundle.js"');
  // Write to dist
  await Deno.writeTextFile("dist/index.html", html);
  
  console.log("HTML processed. Build complete.");

} catch (e) {
  console.error("Build failed:", e);
  Deno.exit(1);
} finally {
  esbuild.stop();
}