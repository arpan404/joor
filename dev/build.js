await Bun.build({
  entrypoints: [
    "./src/app/index.ts",
    "./src/cli/index.ts",
    "./src/types/index.ts",
  ],
  outdir: "build",
  target: "bun",
});
