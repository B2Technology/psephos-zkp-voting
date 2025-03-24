import type { IElection } from "./election.type.ts";
import type { IAnswers } from "./ballot.type.ts";
import type { PshAnswerProtocolEnum } from "./enums.ts";

// TODO copiar os metodos da class
export interface IAnswerGenerate {
  election: IElection;
  getProtocol(): PshAnswerProtocolEnum;
  generate(): Promise<IAnswers<unknown>>;
  generateAuditable(): Promise<IAnswers<unknown>>;
}
