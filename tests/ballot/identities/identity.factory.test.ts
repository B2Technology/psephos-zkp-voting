import type { CiphertextJSON } from "@psephos/elgamal";
import { decodeBytes32String, toBeHex } from "npm:ethers";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { PshIdentityProtocolEnum } from "../../../src/types/index.ts";
import { PshIdentityFactory } from "../../../src/ballot/index.ts";
import { PUBLIC_KEY } from "../../stubs/contants.ts";

Deno.test("PshIdentityFactory::Plaintext", async () => {
  const identity = PshIdentityFactory.Plaintext();

  // Quando não setar o segredo, deve lançar um erro
  await assertRejects(() => identity.generate(), Error, "Secret not set");

  identity.setSecret("my-secret");

  // Gerar a identidade
  const result = await identity.generate();
  assertEquals(result.protocol, PshIdentityProtocolEnum.Plaintext);
  assertEquals(result.proof, "my-secret");
});

Deno.test("PshIdentityFactory::Sha256", async () => {
  const identity = PshIdentityFactory.Sha256();

  // Quando não setar o segredo, deve lançar um erro
  await assertRejects(() => identity.generate(), Error, "Secret not set");
  identity.setSecret("my-secret");

  // Quando não setar o UUID da eleição, deve lançar um erro
  await assertRejects(
    () => identity.generate(),
    Error,
    "Election UUID not set",
  );
  identity.setElectionUUID("b3b99f04");

  // Gerar a identidade
  const result = await identity.generate();
  assertEquals(result.protocol, PshIdentityProtocolEnum.Sha256);
  assertEquals(
    result.proof,
    "c294d303087a6d05392bf40e18d4dbcac9d79ea7c935eff8a25ff67cf13f4477",
  );
});

Deno.test("PshIdentityFactory::ElGamal", async () => {
  const identity = PshIdentityFactory.ElGamal();

  // Quando não setar o segredo, deve lançar um erro
  await assertRejects(() => identity.generate(), Error, "Secret not set");
  identity.setSecret("my-secret");

  // Quando não setar PublicKey, deve lançar um erro
  await assertRejects(() => identity.generate(), Error, "Public key not set");
  identity.setPublicKey(PUBLIC_KEY);

  const result = await identity.generate();
  assertEquals(result.protocol, PshIdentityProtocolEnum.ElGamal);
  assertEquals(
    typeof result.proof.alpha,
    "string",
  );
  assertEquals(
    typeof result.proof.beta,
    "string",
  );
  assertEquals(
    typeof (result as unknown as CiphertextJSON).pk,
    "undefined",
  );
});

Deno.test("PshIdentityFactory::Semaphore", async () => {
  const identity = PshIdentityFactory.Semaphore();
  const scope =
    "10539051404867637704364699798659959237271666986496997127751379105084996204345";

  // Quando não setar o UUID da eleição, deve lançar um erro
  await assertRejects(
    () => identity.generate(),
    Error,
    "Scope not set",
  );
  identity.setScope(scope);

  // Quando não setar o segredo, deve lançar um erro
  await assertRejects(() => identity.generate(), Error, "Secret not set");
  identity.setSecret("my-secret");

  // Quando não setar o Ballot Hash, deve lançar um erro
  await assertRejects(() => identity.generate(), Error, "Ballot Hash not set");
  identity.setBallotHash(
    "b5d54c39e66671c9731b9f471e585d8262cd4f54963f0c93082d8dcf334d4c78",
  );

  // Quando não setar o Merkle Proof, deve lançar um erro
  const merkleProof = identity.simulateMerkleProof();
  await assertRejects(() => identity.generate(), Error, "Merkle Proof not set");
  identity.setMerkleProof(merkleProof);

  // Gerar a identidade
  const result = await identity.generate();
  assertEquals(result.protocol, PshIdentityProtocolEnum.Semaphore);
  assertEquals(
    result.proof.merkleTreeRoot,
    "12525336898133439459434890298970845118400588903713843344550860990868731743023",
  );
  assertEquals(
    result.proof.nullifier,
    "17868722871537428905860400765925825332437156282982297808010230889206389007266",
  );
  assertEquals(result.proof.scope, scope);
  assertEquals(
    decodeBytes32String(toBeHex(result.proof.message, 32)),
    "b5d54c39e666...8dcf334d4c78",
  );
  assertEquals(
    result.proof.points.length,
    8,
  );
});
