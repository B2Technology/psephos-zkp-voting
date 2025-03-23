// REF: https://deno.com/blog/publish-esm-cjs-module-dnt
import { build, emptyDir } from "jsr:@deno/dnt@^0.41.3";
import { parseArgs } from "jsr:@std/cli/parse-args";

const args = parseArgs(Deno.args, {
  alias: {
    v: "version",
    t: "test",
  },
  default: {
    test: false,
  },
  boolean: ["test"],
  string: ["version"],
});

const infoDeno = JSON.parse(Deno.readTextFileSync("deno.json"));
const test = args.test === true;
const version = args.version || infoDeno.version;
const elgamalVersion = infoDeno.imports["@psephos/elgamal"].split("@")[2];

console.log("Building ESM module", { test, version, elgamal: elgamalVersion });

await emptyDir("./dist");

await build({
  entryPoints: [
    "./mod.ts",
    {
      name: "./ballot",
      path: "ballot.ts",
    },
    {
      name: "./types",
      path: "types.ts",
    },
    {
      name: "./utils",
      path: "utils.ts",
    },
    {
      name: "./validator",
      path: "validator.ts",
    },
  ],
  rootTestDir: "./tests",
  outDir: "./dist",
  compilerOptions: {
    lib: ["ES2021", "DOM"],
  },
  shims: {
    deno: test,
    crypto: false,
  },
  test,
  typeCheck: test? false : 'single',
  package: {
    name: infoDeno.name,
    version,
    description: infoDeno.description,
    license: infoDeno.license,
    dependencies: {
      "@psephos/elgamal": elgamalVersion,
    },
    repository: {
      type: "git",
      url: "git+https://github.com/B2Technology/psephos-zkp-voting.git",
    },
    bugs: {
      url: "https://github.com/B2Technology/psephos-zkp-voting/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
    Deno.copyFileSync("README.md", "dist/README.md");

    const customNpmignore = `
test_runner.js
yarn.lock
pnpm-lock.yaml
/src/
node_modules/
  `;

    Deno.writeTextFileSync("./dist/.npmignore", customNpmignore);
  },
});
