import { assertEquals } from "jsr:@std/assert";
import { Ciphertext, ZKDisjunctiveProof } from "@psephos/elgamal";
import {
  disjunctiveChallengeGenerator,
  generatePlaintexts,
} from "@psephos/elgamal/utils";
import { PshAnswerProtocolEnum } from "../../../../../src/types/index.ts";
import { AnswerFactory } from "../../../../../src/ballot/index.ts";
import {
  ELECTION_DATA,
  PUBLIC_KEY,
  SECRET_KEY,
} from "../../../../stubs/contants.ts";

Deno.test("AnswerElgamal::generate", async () => {
  const protocol = AnswerFactory.ElGamal(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET Bilu"]);

  const answers = await protocol.generate();
  const answersLength = ELECTION_DATA.questions[0].answers.length;
  const zero_one_plaintexts = generatePlaintexts(PUBLIC_KEY, 0, 1);
  const choices = answers.proofs[0].choices;
  const individual_proofs = answers.proofs[0].individual_proofs.map((proof) =>
    ZKDisjunctiveProof.fromJsonProofs(proof)
  );

  console.log(answers);

  assertEquals(answers.protocol, PshAnswerProtocolEnum.ElGamal);
  assertEquals(answers.proofs.length, ELECTION_DATA.questions.length);
  assertEquals(answers.proofs[0].individual_proofs.length, answersLength);
  assertEquals(answers.proofs[0].individual_proofs[0].length, answersLength);
  assertEquals(answers.proofs[0].overall_proof.length, answersLength);
  assertEquals(answers.proofs[0].choices.length, answersLength);
  assertEquals(typeof answers.proofs[0].choices[0].alpha, "string");
  assertEquals(typeof answers.proofs[0].choices[0].beta, "string");

  // Primeira opção deve ser marcada com valor maior q zero
  const ciphertext01 = Ciphertext.fromData(choices[0], PUBLIC_KEY);
  const decrypted01 = SECRET_KEY.decrypt(ciphertext01);
  assertEquals(decrypted01.equals(zero_one_plaintexts[1]), true);

  // Segunda opção deve ser marcada com valor zero
  const ciphertext02 = Ciphertext.fromData(choices[1], PUBLIC_KEY);
  const decrypted02 = SECRET_KEY.decrypt(ciphertext02);
  assertEquals(decrypted02.equals(zero_one_plaintexts[0]), true);

  // Verifica se a prova geral é válida
  assertEquals(
    await ciphertext01.verifyDisjunctiveEncryptionProof(
      zero_one_plaintexts,
      individual_proofs[0],
      disjunctiveChallengeGenerator,
    ),
    true,
  );
  assertEquals(
    await ciphertext02.verifyDisjunctiveEncryptionProof(
      zero_one_plaintexts,
      individual_proofs[1],
      disjunctiveChallengeGenerator,
    ),
    true,
  );

  // TODO testar se existe os hash para cada opção
});

Deno.test("AnswerElgamal::generateAuditable", async () => {
  const protocol = AnswerFactory.ElGamal(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET Bilu"]);

  const ballot = await protocol.generateAuditable();
  console.log(ballot);
  // TODO implementes mais tes
});

// TODO simular sem quantidade max
// TODO simular sem quantidade max=1
// TODO simular sem quantidade max=2
// TODO simular cedula em branco (sem opção marcada)
