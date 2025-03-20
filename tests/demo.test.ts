import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Ciphertext, CryptoSystem } from "@psephos/elgamal";
import { BigInteger } from "@psephos/elgamal/utils";
import { CRYPTO_PARAMS } from "./stubs/contants.ts";
import { demo } from "../src/index.ts";

const system = CryptoSystem.fromJSON(CRYPTO_PARAMS);

Deno.test("Ciphertext::construtor", async () => {
  demo();
  const keyPair = await system.generateKeyPair();
  const alpha = new BigInteger("123456789");
  const beta = new BigInteger("987654321");

  const ciphertext = new Ciphertext(alpha, beta, keyPair.pk);

  // Verifica se os valores foram atribuídos corretamente
  assertEquals(ciphertext.alpha.toString(), "123456789");
  assertEquals(ciphertext.beta.toString(), "987654321");
  assertEquals(ciphertext.pk, keyPair.pk);
});
