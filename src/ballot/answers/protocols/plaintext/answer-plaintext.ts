import type {
  IAnswerGenerate,
  IAnswers,
  IPshElection,
} from "../../../../types/index.ts";
import { PshAnswerProtocolEnum } from "../../../../types/index.ts";
import { AnswerBase } from "../base/answer-base.ts";
import type { IAnswerAuditablePlaintext, IAnswerPlaintext } from "./types.ts";

// TODO copiar alguns metodos para Interface

export class AnswerPlaintext extends AnswerBase
  implements IAnswerGenerate<IAnswerPlaintext> {
  constructor(
    election: IPshElection,
  ) {
    super(election);
  }

  getProtocol(): PshAnswerProtocolEnum {
    return PshAnswerProtocolEnum.Plaintext;
  }

  async generate(): Promise<IAnswers<IAnswerPlaintext>> {
    const proofs = this.getAnswers().map<IAnswerPlaintext>((
      answers,
      qIndex,
    ) => ({
      choices: answers.map((ai) => this.election.questions[qIndex].answers[ai]),
    }));

    return {
      proofs,
      hashes: await this.appendedHashes(proofs),
      protocol: this.getProtocol(),
    };
  }

  async generateAuditable(): Promise<IAnswers<IAnswerAuditablePlaintext>> {
    const allAnswers = this.getAnswers();
    const proofs = allAnswers.map<IAnswerAuditablePlaintext>((
      answers,
      qIndex,
    ) => ({
      choices: answers.map((ai) => this.election.questions[qIndex].answers[ai]),
      answers,
    }));

    return {
      proofs,
      hashes: await this.appendedHashes(proofs),
      protocol: this.getProtocol(),
    };
  }
}
