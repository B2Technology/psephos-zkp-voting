import type { IElection } from "./election.type.ts";
import type { IBallot } from "./ballot.type.ts";

// TODO copiar os metodos da class
export interface IBallotGenerate {
  election: IElection;
  generate(): Promise<IBallot<unknown>>;
}
