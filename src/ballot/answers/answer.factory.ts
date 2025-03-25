import type { PublicKey } from "@psephos/elgamal";
import {
  type IAnswerGenerate,
  type IPshElection,
  PshAnswerProtocolEnum,
} from "../../types/index.ts";
import { AnswerElgamal } from "./protocols/elgamal/answer-elgamal.ts";
import { AnswerHelios } from "./protocols/helios/answer-helios.ts";

export class PshAnswerFactory {
  static make(
    protocol: PshAnswerProtocolEnum,
    election: IPshElection,
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

  static ElGamal(election: IPshElection, publicKey: PublicKey): AnswerElgamal {
    return new AnswerElgamal(election, publicKey);
  }

  static Helios(election: IPshElection, publicKey: PublicKey): AnswerHelios {
    return new AnswerHelios(election, publicKey);
  }
}
