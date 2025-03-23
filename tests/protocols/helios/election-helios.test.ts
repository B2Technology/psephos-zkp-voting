import { assertEquals, assertExists, equal } from "@std/assert";
import { ElectionHelios } from "../../../src/protocols/helios/election-helios.ts";
import { BallotFactory } from "../../../src/ballot/index.ts";
import {
  ELECTION_DATA,
  EXPECTED_BALLOT,
  EXPECTED_HASH,
  PUBLIC_KEY,
} from "./data.ts";

Deno.test("ElectionHelios::makeHash", async () => {
  const hash = await ElectionHelios.makeHash(ELECTION_DATA, PUBLIC_KEY);

  assertEquals(hash, EXPECTED_HASH);
});

Deno.test("ElectionHelios::makeHash", async () => {
  const protocol = BallotFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  // const ballotPsh = await protocol.generateAuditable();
  // console.log(ballotPsh);

  const ballotHelios = await protocol
    .toAuditableHeliosObject();

  console.log(JSON.stringify(ballotHelios, null, 2));

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
