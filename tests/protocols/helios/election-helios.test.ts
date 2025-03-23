import { expect } from "@std/expect";
import { PublicKey } from "../../../../elgamal-psephos/src/index.ts";
import { ElectionHelios } from "../../../src/protocols/helios/election-helios.ts";
import type { IElection } from "../../../src/types/index.ts";
import { BallotFactory } from "../../../src/ballot/index.ts";
import {
  IAnswerAuditableHelios,
  IBallotHelios,
} from "../../../src/protocols/helios/types.ts";
import {
  ELECTION_DATA,
  EXPECTED_BALLOT,
  EXPECTED_HASH,
  PUBLIC_KEY,
} from "./data.ts";
import { BigInteger } from "../../../../elgamal-psephos/src/utils/index.ts";

Deno.test("ElectionHelios::makeHash", async () => {
  const hash = await ElectionHelios.makeHash(ELECTION_DATA, PUBLIC_KEY);

  expect(hash).toEqual(EXPECTED_HASH);
});

Deno.test("ElectionHelios::makeHash", async () => {
  const randomness = [
    new BigInteger(
      "37107076284056283178515773079434393163882760506451274717937256575697190842041",
    ),
    new BigInteger(
      "34360614088207237053562508122339603052104842502866134597083823490970308090364",
    ),
  ];

  const protocol = BallotFactory.Helios(ELECTION_DATA, PUBLIC_KEY);
  protocol.setAnswers(0, ["ET varginha"]);

  // const ballotPsh = await protocol.generateAuditable();
  // console.log(ballotPsh);

  const ballotHelios = await protocol
    .toAuditableHeliosObject(randomness);

  console.log(JSON.stringify(ballotHelios, null, 2));

  expect(ballotHelios.election_hash).toBe(EXPECTED_BALLOT.election_hash);
  expect(ballotHelios.election_uuid).toBe(EXPECTED_BALLOT.election_uuid);
  expect(ballotHelios.answers).toHaveLength(1);
  expect(ballotHelios.answers[0].answer).toMatchObject(EXPECTED_BALLOT.answers[0].answer as any);
  expect(ballotHelios.answers[0].choices).toHaveLength(2);
  expect(ballotHelios.answers[0].choices[0]).toMatchObject(EXPECTED_BALLOT.answers[0].choices[0] as any);
  expect(ballotHelios.answers[0].choices[0].alpha).toBeDefined();
  expect(ballotHelios.answers[0].choices[0].beta).toBeDefined();
  expect(ballotHelios.answers[0].individual_proofs).toHaveLength(2);
  expect(ballotHelios.answers[0].individual_proofs[0]).toHaveLength(2);
  expect(ballotHelios.answers[0].individual_proofs[0][0]).toMatchObject(EXPECTED_BALLOT.answers[0].individual_proofs[0][0] as any);
  expect(ballotHelios.answers[0].individual_proofs[0][0].response).toBeDefined();
  expect(ballotHelios.answers[0].individual_proofs[0][0].challenge).toBeDefined();
  expect(ballotHelios.answers[0].individual_proofs[0][0].commitment.A).toBeDefined();
  expect(ballotHelios.answers[0].overall_proof).toHaveLength(2);
  expect(ballotHelios.answers[0].overall_proof[0].response).toBeDefined();
  expect(ballotHelios.answers[0].overall_proof[0].challenge).toBeDefined();
  expect(ballotHelios.answers[0].overall_proof[0].commitment.A).toBeDefined();
  expect(ballotHelios.answers[0].randomness).toHaveLength(2);
  expect(ballotHelios.answers[0].randomness).toMatchObject(EXPECTED_BALLOT.answers[0].randomness as any);
  expect(ballotHelios).toMatchObject(EXPECTED_BALLOT as any);
});
