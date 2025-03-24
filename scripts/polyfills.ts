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

const dist =
  `${home}/.cache/deno/npm/registry.npmjs.org/ffjavascript/0.3.0/src/threadman.js`;

console.log("📂 Copying threadman.js to:", dist);
Deno.copyFileSync("./scripts/mods/ffjavascript/threadman.js", dist);
