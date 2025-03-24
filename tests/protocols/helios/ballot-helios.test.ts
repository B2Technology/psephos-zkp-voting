import { assertEquals, assertExists, equal } from "jsr:@std/assert";
import type { IAnswerAuditableHelios } from "../../../src/protocols/helios/types.ts";
import { BallotFactory } from "../../../src/ballot/index.ts";
import { PshProtocolEnum } from "../../../src/types/index.ts";
import { ELECTION_DATA, EXPECTED_BALLOT, PUBLIC_KEY } from "./data.ts";

Deno.test("BallotHelios::generate", async () => {
  const protocol = BallotFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const ballotPsh = await protocol.generate();
  console.log(ballotPsh);

  console.log(JSON.stringify(ballotPsh, null, 2));

  // answer e randomness nao devem ser retornados
  const answerUnknown = ballotPsh
    .answers[0] as unknown as IAnswerAuditableHelios;
  assertEquals(answerUnknown.answer, undefined);
  assertEquals(answerUnknown.randomness, undefined);

  // Check root level properties
  assertEquals(ballotPsh.protocol, PshProtocolEnum.Helios);
  // assertEquals(ballotPsh.election_hash, "???");// TODO fix
  // assertEquals(ballotPsh.ballot_hash, "???");
  // assertEquals(ballotPsh.app_signature, "???");
  // assertEquals(ballotPsh.voter_proof, "???");
  // assertEquals(ballotPsh.election_uuid, "???");

  //////////////

  // assertEquals(ballotPsh.election_hash, EXPECTED_BALLOT.election_hash); // TODO fix
  assertEquals(ballotPsh.election_uuid, EXPECTED_BALLOT.election_uuid);
  assertEquals(ballotPsh.answers.length, 1);

  assertEquals(ballotPsh.answers[0].choices.length, 2);
  assertExists(ballotPsh.answers[0].choices[0].alpha);
  assertExists(ballotPsh.answers[0].choices[0].beta);
  assertEquals(ballotPsh.answers[0].individual_proofs.length, 2);
  assertEquals(ballotPsh.answers[0].individual_proofs[0].length, 2);
  assertExists(ballotPsh.answers[0].individual_proofs[0][0].response);
  assertExists(ballotPsh.answers[0].individual_proofs[0][0].challenge);
  assertExists(ballotPsh.answers[0].individual_proofs[0][0].commitment.A);
  assertEquals(ballotPsh.answers[0].overall_proof.length, 2);
  assertExists(ballotPsh.answers[0].overall_proof[0].response);
  assertExists(ballotPsh.answers[0].overall_proof[0].challenge);
  assertExists(ballotPsh.answers[0].overall_proof[0].commitment.A);
});

Deno.test("BallotHelios::generateAuditable", async () => {
  const protocol = BallotFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const ballotPsh = await protocol.generateAuditable();
  console.log(ballotPsh);

  console.log(JSON.stringify(ballotPsh, null, 2));

  // assertEquals(ballotPsh.election_hash, EXPECTED_BALLOT.election_hash); // TODO fix
  assertEquals(ballotPsh.election_uuid, EXPECTED_BALLOT.election_uuid);
  assertEquals(ballotPsh.answers.length, 1);
  equal(
    ballotPsh.answers[0].answer,
    EXPECTED_BALLOT.answers[0].answer,
  );
  assertEquals(ballotPsh.answers[0].choices.length, 2);
  assertExists(ballotPsh.answers[0].choices[0].alpha);
  assertExists(ballotPsh.answers[0].choices[0].beta);
  assertEquals(ballotPsh.answers[0].individual_proofs.length, 2);
  assertEquals(ballotPsh.answers[0].individual_proofs[0].length, 2);
  assertExists(ballotPsh.answers[0].individual_proofs[0][0].response);
  assertExists(ballotPsh.answers[0].individual_proofs[0][0].challenge);
  assertExists(ballotPsh.answers[0].individual_proofs[0][0].commitment.A);
  assertEquals(ballotPsh.answers[0].overall_proof.length, 2);
  assertExists(ballotPsh.answers[0].overall_proof[0].response);
  assertExists(ballotPsh.answers[0].overall_proof[0].challenge);
  assertExists(ballotPsh.answers[0].overall_proof[0].commitment.A);
  assertEquals(ballotPsh.answers[0].randomness.length, 2);
});

Deno.test("BallotHelios::toHeliosObject", async () => {
  const protocol = BallotFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const ballotHelios = await protocol
    .toHeliosObject();

  // answer e randomness nao devem ser retornados
  const answerUnknown = ballotHelios
    .answers[0] as unknown as IAnswerAuditableHelios;
  assertEquals(answerUnknown.answer, undefined);
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
  const protocol = BallotFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  const ballotHelios = await protocol
    .toAuditableHeliosObject();

  assertEquals(ballotHelios.election_hash, EXPECTED_BALLOT.election_hash);
  assertEquals(ballotHelios.election_uuid, EXPECTED_BALLOT.election_uuid);
  assertEquals(ballotHelios.answers.length, 1);
  equal(
    ballotHelios.answers[0].answer,
    EXPECTED_BALLOT.answers[0].answer,
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
