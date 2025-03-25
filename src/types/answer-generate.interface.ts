import type { IPshElection } from "./election.type.ts";
import type { IAnswers } from "./ballot.type.ts";
import type { PshAnswerProtocolEnum } from "./enums.ts";

// TODO copiar os metodos da class
export interface IAnswerGenerate<A> {
  election: IPshElection;
  getProtocol(): PshAnswerProtocolEnum;

  generate(): Promise<IAnswers<A>>;
  generateAuditable(): Promise<IAnswers<A>>;

  getAnswer(questionIndex: number): number[];
  getAnswers(): Array<number[]>;
  setAnswers(questionIndex: number, answers: string[]): void;
}
