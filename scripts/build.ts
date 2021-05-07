import { build } from "esbuild";

interface BuildOptions {
  env: "production" | "development";
}

export async function buildApp(options: BuildOptions) {
  const { env } = options;

  await build({
    entryPoints: ["packages/app/src/index.tsx"],
    outfile: "packages/app/public/script.js",
    define: {
      "process.env.NODE_ENV": `"${env}"`,
    },
    bundle: true,
    minify: env === "production",
    sourcemap: env === "development",
  });
}

export async function buildServer(options: BuildOptions) {
  const { env } = options;

  await build({
    entryPoints: ["packages/server/src/index.ts"],
    outfile: "packages/server/dist/index.js",
    define: {
      "process.env.NODE_ENV": `"${env}"`,
    },
    external: ["express"], // Some libraries have to be marked as external
    platform: "node", // When building for node we need to setup the environement for it
    target: "node14.15.5",
    bundle: true,
    minify: env === "production",
    sourcemap: env === "development",
  });
}

async function buildAll() {
  await Promise.all([
    buildApp({
      env: "production",
    }),
    buildServer({
      env: "development",
    }),
  ]);
}

buildAll();
