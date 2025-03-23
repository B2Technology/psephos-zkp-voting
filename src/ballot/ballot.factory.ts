import type { PublicKey } from "@psephos/elgamal";
import type { IElection } from "../types/index.ts";
import { BallotElGamal } from "../protocols/elgamal/ballot-elgamal.ts";
import {BallotHelios} from "../protocols/helios/ballot-helios.ts";

export class BallotFactory {
  static ElGamal(election: IElection, publicKey: PublicKey): BallotElGamal {
    return new BallotElGamal(election, publicKey);
  }

  static Helios(election: IElection, publicKey: PublicKey): BallotHelios{
    return new BallotHelios(election, publicKey);
  }
}
