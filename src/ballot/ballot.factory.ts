import type { PublicKey } from "@psephos/elgamal";
import type { IElection } from "../types/index.ts";
import { BallotElGamal } from "../protocols/elgamal/ballot-el-gamal.ts";

export class BallotFactory {
  static ElGamal(election: IElection, publicKey: PublicKey): BallotElGamal {
    return new BallotElGamal(election, publicKey);
  }
}
