import type { IPshElection } from "./election.type.ts";
import type { IAnswers } from "./ballot.type.ts";
import type { PshAnswerProtocolEnum } from "./enums.ts";

// TODO copiar os metodos da class
export interface IAnswerGenerate {
  election: IPshElection;
  getProtocol(): PshAnswerProtocolEnum;
  generate(): Promise<IAnswers<unknown>>;
  generateAuditable(): Promise<IAnswers<unknown>>;
}
