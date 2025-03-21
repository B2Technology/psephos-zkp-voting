// REF: https://deno.com/blog/publish-esm-cjs-module-dnt
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";
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

console.log("Building ESM module", { test, version });

await emptyDir("./dist");

await build({
  entryPoints: [
    "./mod.ts",
    {
      name: "./ballot",
      path: "./ballot.ts",
    },
    {
      name: "./types",
      path: "./types.ts",
    },
    {
      name: "./utils",
      path: "./utils.ts",
    },
    {
      name: "./validator",
      path: "./validator.ts",
    },
  ],
  rootTestDir: "./tests",
  outDir: "./dist",
  compilerOptions: {
    lib: ["ES2021", "DOM"],
    target: "ES2021",
  },
  shims: {
    deno: test,
    crypto: false,
  },
  mappings: {
    "npm:@psephos/elgamal/utils": {
      name: "@psephos/elgamal",
      version: "^1.0.6",
      subPath: "utils"
    },
    "npm:@psephos/elgamal": {
      name: "@psephos/elgamal",
      version: "^1.0.6"
    }
  },
  scriptModule: false,
  package: {
    name: infoDeno.name,
    version,
    description: infoDeno.description,
    license: infoDeno.license,
    dependencies: {
      "@psephos/elgamal": "^1.0.6",
    },
    exports: {
      ".": {
        import: "./esm/mod.js",
        require: "./script/mod.js",
      },
      "./ballot": {
        import: "./esm/ballot.js",
        require: "./script/ballot.js",
      },
      "./types": {
        import: "./esm/types.js",
        require: "./script/types.js",
      },
      "./utils": {
        import: "./esm/utils.js",
        require: "./script/utils.js",
      },
      "./validator": {
        import: "./esm/validator.js",
        require: "./script/validator.js",
      },
    },
    repository: {
      type: "git",
      url: "git+https://github.com/B2Technology/psephos-zkp-voting.git",
    },
    bugs: {
      url: "https://github.com/B2Technology/psephos-zkp-voting/issues",
    },
    private: false,
  },
  test,
  typeCheck: "both",
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

    // if (!test) {
    //   await Deno.remove("./dist/node_modules", { recursive: true });
    // }
  },
});
