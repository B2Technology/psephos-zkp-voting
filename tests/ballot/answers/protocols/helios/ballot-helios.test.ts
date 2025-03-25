import { assertEquals, assertExists, equal } from "jsr:@std/assert";
import type { IAnswerAuditableHelios } from "../../../../../src/ballot/index.ts";
import {
  type IAnswers,
  PshAnswerProtocolEnum,
} from "../../../../../src/types/index.ts";
import { PshAnswerFactory } from "../../../../../src/ballot/index.ts";
import { ELECTION_DATA, EXPECTED_BALLOT, PUBLIC_KEY } from "./data.ts";

Deno.test("BallotHelios::generate", async () => {
  const protocol = PshAnswerFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const heliosIAnswers = await protocol.generate();

  // Check object
  assertEquals(heliosIAnswers.protocol, PshAnswerProtocolEnum.Helios);
  assertEquals(heliosIAnswers.proofs[0].choices.length, 2);
  assertExists(heliosIAnswers.proofs[0].choices[0].alpha);
  assertExists(heliosIAnswers.proofs[0].choices[0].beta);
  assertEquals(heliosIAnswers.proofs[0].individual_proofs.length, 2);
  assertEquals(heliosIAnswers.proofs[0].individual_proofs[0].length, 2);
  assertExists(heliosIAnswers.proofs[0].individual_proofs[0][0].response);
  assertExists(heliosIAnswers.proofs[0].individual_proofs[0][0].challenge);
  assertExists(heliosIAnswers.proofs[0].individual_proofs[0][0].commitment.A);
  assertEquals(heliosIAnswers.proofs[0].overall_proof.length, 2);
  assertExists(heliosIAnswers.proofs[0].overall_proof[0].response);
  assertExists(heliosIAnswers.proofs[0].overall_proof[0].challenge);
  assertExists(heliosIAnswers.proofs[0].overall_proof[0].commitment.A);

  // answer e randomness nao devem ser retornados
  const answerUnknown = heliosIAnswers as IAnswers<IAnswerAuditableHelios>;
  assertEquals(answerUnknown.proofs[0].answers, undefined);
  assertEquals(answerUnknown.proofs[0].randomness, undefined);
});

Deno.test("BallotHelios::generateAuditable", async () => {
  const protocol = PshAnswerFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const ballotPsh = await protocol.generateAuditable();

  assertEquals(ballotPsh.protocol, PshAnswerProtocolEnum.Helios);
  assertEquals(ballotPsh.proofs.length, 1);
  equal(
    ballotPsh.proofs[0].answers,
    EXPECTED_BALLOT.answers[0].answers,
  );
  assertEquals(ballotPsh.proofs[0].choices.length, 2);
  assertExists(ballotPsh.proofs[0].choices[0].alpha);
  assertExists(ballotPsh.proofs[0].choices[0].beta);
  assertEquals(ballotPsh.proofs[0].individual_proofs.length, 2);
  assertEquals(ballotPsh.proofs[0].individual_proofs[0].length, 2);
  assertExists(ballotPsh.proofs[0].individual_proofs[0][0].response);
  assertExists(ballotPsh.proofs[0].individual_proofs[0][0].challenge);
  assertExists(ballotPsh.proofs[0].individual_proofs[0][0].commitment.A);
  assertEquals(ballotPsh.proofs[0].overall_proof.length, 2);
  assertExists(ballotPsh.proofs[0].overall_proof[0].response);
  assertExists(ballotPsh.proofs[0].overall_proof[0].challenge);
  assertExists(ballotPsh.proofs[0].overall_proof[0].commitment.A);
  assertEquals(ballotPsh.proofs[0].randomness.length, 2);
});

Deno.test("BallotHelios::toHeliosObject", async () => {
  const protocol = PshAnswerFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const ballotHelios = await protocol
    .toHeliosObject();

  // answer e randomness nao devem ser retornados
  const answerUnknown = ballotHelios
    .answers[0] as unknown as IAnswerAuditableHelios;
  assertEquals(answerUnknown.answers, undefined);
  assertEquals(answerUnknown.randomness, undefined);

  assertEquals(ballotHelios.election_hash, EXPECTED_BALLOT.election_hash);
  assertEquals(ballotHelios.election_uuid, EXPECTED_BALLOT.election_uuid);
  assertEquals(ballotHelios.answers.length, 1);

  assertEquals(ballotHelios.answers[0].choices.length, 2);
  assertExists(ballotHelios.answers[0].choices[0].alpha);
  assertExists(ballotHelios.answers[0].choices[0].beta);
  assertEquals(ballotHelios.answers[0].individual_proofs.length, 2);
  assertEquals(ballotHelios.answers[0].individual_proofs[0].length, 2);
  assertExists(ballotHelios.answers[0].individual_proofs[0][0].response);
  assertExists(ballotHelios.answers[0].individual_proofs[0][0].challenge);
  assertExists(ballotHelios.answers[0].individual_proofs[0][0].commitment.A);
  assertEquals(ballotHelios.answers[0].overall_proof.length, 2);
  assertExists(ballotHelios.answers[0].overall_proof[0].response);
  assertExists(ballotHelios.answers[0].overall_proof[0].challenge);
  assertExists(ballotHelios.answers[0].overall_proof[0].commitment.A);
});

Deno.test("BallotHelios::toAuditableHeliosObject", async () => {
  const protocol = PshAnswerFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const ballotHelios = await protocol
    .toAuditableHeliosObject();

  assertEquals(ballotHelios.election_hash, EXPECTED_BALLOT.election_hash);
  assertEquals(ballotHelios.election_uuid, EXPECTED_BALLOT.election_uuid);
  assertEquals(ballotHelios.answers.length, 1);
  equal(
    ballotHelios.answers[0].answers,
    EXPECTED_BALLOT.answers[0].answers,
  );
  assertEquals(ballotHelios.answers[0].choices.length, 2);
  assertExists(ballotHelios.answers[0].choices[0].alpha);
  assertExists(ballotHelios.answers[0].choices[0].beta);
  assertEquals(ballotHelios.answers[0].individual_proofs.length, 2);
  assertEquals(ballotHelios.answers[0].individual_proofs[0].length, 2);
  assertExists(ballotHelios.answers[0].individual_proofs[0][0].response);
  assertExists(ballotHelios.answers[0].individual_proofs[0][0].challenge);
  assertExists(ballotHelios.answers[0].individual_proofs[0][0].commitment.A);
  assertEquals(ballotHelios.answers[0].overall_proof.length, 2);
  assertExists(ballotHelios.answers[0].overall_proof[0].response);
  assertExists(ballotHelios.answers[0].overall_proof[0].challenge);
  assertExists(ballotHelios.answers[0].overall_proof[0].commitment.A);
  assertEquals(ballotHelios.answers[0].randomness.length, 2);
});
