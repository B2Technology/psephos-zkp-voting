import type { PublicKey } from "@psephos/elgamal";
import { joinToSha256, objectToSha256, sha256 } from "../utils/index.ts";
import type {
  IAnswerGenerate,
  IAppClient,
  IBallot,
  IIdentityGenerate,
  IPshElection,
} from "../types/index.ts";
import { PshIdentityFactory } from "./identities/index.ts";
import { PshAnswerFactory } from "./answers/index.ts";

// TODO implements

export type PshBallotBuilderProps = {
  election: IPshElection;
  publicKey: PublicKey;
  secret: string;
  client_api: string;
  client_secret: string;
};

export class PshBallotBuilder<A = unknown, I = unknown> {
  private readonly identityGen: IIdentityGenerate<I>;
  private readonly answerGen: IAnswerGenerate<A>;

  constructor(
    private readonly props: PshBallotBuilderProps,
  ) {
    this.identityGen = PshIdentityFactory.make(
      props.election.identity_protocol,
    ) as IIdentityGenerate<I>;

    this.identityGen.setSecret(this.props.secret);

    this.answerGen = PshAnswerFactory.make(
      props.election.answer_protocol,
      props.election,
      props.publicKey,
    ) as IAnswerGenerate<A>;
  }

  setAnswers(questionIndex: number, answers: string[]): void {
    this.answerGen.setAnswers(questionIndex, answers);
  }

  async makeBallot(auditable?: boolean): Promise<IBallot<A, I>> {
    const [answers, identity] = await Promise.all([
      auditable
        ? this.answerGen.generateAuditable()
        : this.answerGen.generate(),
      this.identityGen.generate(),
    ]);

    const overall_answers_hash = await this.getBallotHash(answers.hashes);
    const app = await this.getAppSignature(overall_answers_hash);

    return {
      app,
      answers,
      identity,
      overall_answers_hash,
      election_uuid: this.getElectionUUID(),
      election_hash: await this.getElectionHash(),
    };
  }

  private getElectionHash(): Promise<string> {
    return objectToSha256(this.props.election);
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

  private async getAppSignature(
    overall_answers_hash: string,
  ): Promise<IAppClient> {
    if (!this.props.client_secret || !this.props.client_api) {
      throw new Error("Client secret or client api not found");
    }

    return {
      proof: await joinToSha256(overall_answers_hash, this.props.client_secret),
      client_api: this.props.client_api,
    };
  }
}
