// usage: node pipeline/qa_stills.mjs <compositionId> <outDir> <frame,frame,...> [scale]
// Bundles once and renders the listed frames as JPEGs (faster than a full --sequence render for QA).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const [id, outDir, framesArg, scaleArg] = process.argv.slice(2);
const browserExecutable = path.resolve(".browsers/chrome-headless-shell-linux64/chrome-headless-shell");
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of framesArg.split(",").map(Number)) {
  const frame = Math.min(f, composition.durationInFrames - 1);
  await renderStill({ serveUrl, composition, frame, output: path.join(outDir, `f${String(frame).padStart(4, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 85, scale: Number(scaleArg ?? 0.5), browserExecutable });
}
console.log("frames", composition.durationInFrames);
