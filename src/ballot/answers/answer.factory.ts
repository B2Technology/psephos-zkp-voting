import type { PublicKey } from "@psephos/elgamal";
import {
  type IAnswerGenerate,
  type IElection,
  PshAnswerProtocolEnum,
} from "../../types/index.ts";
import { AnswerElgamal } from "./protocols/elgamal/answer-elgamal.ts";
import { AnswerHelios } from "./protocols/helios/answer-helios.ts";

export class PshAnswerFactory {
  static make(
    protocol: PshAnswerProtocolEnum,
    election: IElection,
    publicKey: PublicKey,
  ): IAnswerGenerate {
    switch (protocol) {
      case PshAnswerProtocolEnum.ElGamal:
        return PshAnswerFactory.ElGamal(election, publicKey);

      case PshAnswerProtocolEnum.Helios:
        return PshAnswerFactory.Helios(election, publicKey);

      default:
        throw new Error(`Unsupported PshAnswerProtocolEnum.${protocol}`);
    }
  }

  static ElGamal(election: IElection, publicKey: PublicKey): AnswerElgamal {
    return new AnswerElgamal(election, publicKey);
  }

  static Helios(election: IElection, publicKey: PublicKey): AnswerHelios {
    return new AnswerHelios(election, publicKey);
  }
}
