/**
 * Ao executar em ambiente "Deno", o código acima não funcionará, pois a biblioteca "semaphore" utiliza a biblioteca "ffjavascript" que não é compatível com o Deno.
 *
 * Para resolver este problema, é necessário realizar a cópia do arquivo "threadman.js" da biblioteca "ffjavascript" para o diretório de cache do Deno.
 *
 * REF: https://github.com/iden3/ffjavascript/issues/132
 */

const home = Deno.env.get("HOME");

if (!home) {
  console.error("HOME not found");
  Deno.exit(1);
}

const dist1 =
  `${home}/.cache/deno/npm/registry.npmjs.org/ffjavascript/0.3.0/src/threadman.js`;

console.log("📂 Copying threadman.js to:", dist1);
Deno.copyFileSync("./scripts/mods/ffjavascript/threadman.js", dist1);

const dist2 =
  `${home}/.cache/deno/npm/registry.npmjs.org/circom_runtime/0.1.25/js/witness_calculator.js`;

console.log("📂 Copying witness_calculator.js to:", dist2);
Deno.copyFileSync("./scripts/mods/circom_runtime/witness_calculator.js", dist2);
