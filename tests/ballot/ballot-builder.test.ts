import { assertEquals, assertObjectMatch } from "jsr:@std/assert";
import type { IAnswerPlaintext } from "../../src/ballot/index.ts";
import {
  PshAnswerProtocolEnum,
  PshIdentityProtocolEnum,
} from "../../src/types/index.ts";
import type { PshBallotBuilderProps } from "../../src/ballot/index.ts";
import { PshBallotBuilder } from "../../src/index.ts";
import { sha256 } from "../../src/utils/index.ts";
import { ELECTION_DATA, PUBLIC_KEY } from "../stubs/contants.ts";

Deno.test("PshBallotBuilder [ID Plaintext, AW Plaintext]", async () => {
  const props: PshBallotBuilderProps = {
    election: {
      ...ELECTION_DATA,
      identity_protocol: PshIdentityProtocolEnum.Plaintext,
      answer_protocol: PshAnswerProtocolEnum.Plaintext,
    },
    publicKey: PUBLIC_KEY,
    secret: "fake-secret-plaintext",
    client_api: "api-xpto-1234",
    client_secret: "123456789",
  };

  const builder = new PshBallotBuilder<IAnswerPlaintext>(props);

  builder.setAnswers(0, ["ET varginha"]);

  const ballotAuditable = await builder.makeBallot(true);
  assertObjectMatch(ballotAuditable.answers, {
    "proofs": [
      {
        "choices": [
          "ET varginha",
        ],
        "answers": [
          1,
        ],
      },
    ],
    "hashes": [
      "1c61f2daf589f25dd7e8f75b9ddd04d69f7b452bbed38e2d5c435b51fe8c21eb",
    ],
    "protocol": "Plaintext",
  });
  assertEquals(
    ballotAuditable.overall_answers_hash,
    await sha256(
      "1c61f2daf589f25dd7e8f75b9ddd04d69f7b452bbed38e2d5c435b51fe8c21eb",
    ),
  );

  const ballot = await builder.makeBallot();
  console.log(JSON.stringify(ballot, null, 2));

  assertObjectMatch(ballot.answers, {
    "proofs": [
      {
        "choices": [
          "ET varginha",
        ],
      },
    ],
    "hashes": [
      "892025b69e5444161729102cf13fed0ec0faccf93d58f9f09d398bf59f32cde4",
    ],
    "protocol": "Plaintext",
  });

  assertEquals(
    ballot.overall_answers_hash,
    await sha256(
      "892025b69e5444161729102cf13fed0ec0faccf93d58f9f09d398bf59f32cde4",
    ),
  );

  assertObjectMatch(ballot.identity, {
    "proof": props.secret,
    "protocol": PshIdentityProtocolEnum.Plaintext,
  });

  assertObjectMatch(ballot.app, {
    "proof": "0906255b752b49d5546e8d2217fca4522c237aa77eb62fede0073f9e066b20c2",
    "client_api": props.client_api,
  });

  assertEquals(ballot.election_uuid, ELECTION_DATA.uuid);
  assertEquals(
    ballot.election_hash,
    "b5c89325c67a0112aaac26816b57bcfa549cffe27799e255065f48ea3ed4f31a",
  );
});
