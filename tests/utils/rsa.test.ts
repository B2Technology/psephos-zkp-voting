import { assertEquals, assertRejects } from "jsr:@std/assert";
import { PshRSA } from "../../src/utils/index.ts";

Deno.test("PshRSA", async () => {
  // 1. Gerar um par de chaves com passphrase
  const passphrase = "senha-muito-segura";
  const keys = await PshRSA.generateKeyPair(2048, passphrase);

  // 2. Texto a ser criptografado
  const mensagemOriginal = "Mensagem secreta para criptografar com RSA-OAEP";

  // 3. Criptografar com a chave pública
  const mensagemCriptografada = await PshRSA.encrypt(
    mensagemOriginal,
    keys.publicKey,
  );

  // 4. Descriptografar com a chave privada - fornecendo a passphrase
  const mensagemDescriptografada = await PshRSA.decrypt(
    mensagemCriptografada,
    keys.privateKey,
    passphrase,
  );

  // 5. Verificar se a descriptografia foi bem-sucedida
  assertEquals(mensagemOriginal, mensagemDescriptografada);

  // 6. Tentativa com passphrase incorreta
  assertRejects(
    () =>
      PshRSA.decrypt(
        mensagemCriptografada,
        keys.privateKey,
        "senha-errada",
      ),
    Error,
    "Erro na descriptografia!",
  );
});
