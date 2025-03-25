import type { PublicKey } from "@psephos/elgamal";
import type {
  IAnswerGenerate,
  IBallot,
  IIdentityGenerate,
  IPshElection,
} from "../types/index.ts";
import { PshIdentityFactory } from "./identities/index.ts";
import { PshAnswerFactory } from "./answers/index.ts";
import { sha256 } from "../utils/index.ts";

// TODO implements

type PshBallotBuilderProps = {
  election: IPshElection;
  publicKey: PublicKey;
  secret: string;
};

export class PshBallotBuilder {
  private readonly identityGen: IIdentityGenerate;
  private readonly answerGen: IAnswerGenerate;

  constructor(
    private readonly props: PshBallotBuilderProps,
  ) {
    this.identityGen = PshIdentityFactory.make(
      props.election.identity_protocol,
    );
    this.identityGen.setSecret(this.props.secret);

    this.answerGen = PshAnswerFactory.make(
      props.election.answer_protocol,
      props.election,
      props.publicKey,
    );
  }

  async makeBallot(): Promise<IBallot<unknown, unknown>> {
    const answers = await this.answerGen.generate();
    const identity = await this.identityGen.generate();

    return {
      answers,
      identity,
      election_uuid: this.getElectionUUID(),
      election_hash: this.getElectionHash(),
      overall_answers_hash: await this.getBallotHash(answers.hashes),
      app: {
        proof: "fake-proof",
        client_api: "fake-client-api",
      },
    };
  }

  private getElectionHash(): string {
    return "fake-election-hash";
  }

  private getBallotHash(hashes: string[]): Promise<string> {
    const hash = hashes.join(",");
    return sha256(hash);
  }

  private getElectionUUID(): string {
    const uuid = this.props.election.uuid;

    if (!uuid) {
      throw new Error("Election UUID not found");
    }

    return uuid;
  }
}
