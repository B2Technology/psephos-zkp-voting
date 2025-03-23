import type { IAnswerElGamal } from "../elgamal/types.ts";

// TODO implementar protocol Helios
export interface IBallotHelios {
  answers: IAnswerElGamal[];
  election_hash: string;
  election_uuid: string;
}
