import {
  type IIdentityGenerate,
  PshIdentityProtocolEnum,
} from "../../types/index.ts";
import { SemaphoreIdentity } from "./protocols/semaphore-identity.ts";
import { PlaintextIdentity } from "./protocols/plaintext-identity.ts";
import { ElgamalIdentity } from "./protocols/elgamal-identity.ts";
import { Sha256Identity } from "./protocols/sha256-identity.ts";

export class PshIdentityFactory {
  static make(
    protocol: PshIdentityProtocolEnum,
  ): IIdentityGenerate {
    switch (protocol) {
      case PshIdentityProtocolEnum.Plaintext:
        return PshIdentityFactory.Plaintext();

      case PshIdentityProtocolEnum.Sha256:
        return PshIdentityFactory.Sha256();

      case PshIdentityProtocolEnum.ElGamal:
        return PshIdentityFactory.ElGamal();

      case PshIdentityProtocolEnum.Semaphore:
        return PshIdentityFactory.Semaphore();

      default:
        throw new Error(`Unsupported PshIdentityProtocolEnum.${protocol}`);
    }
  }

  static Plaintext(): PlaintextIdentity {
    return new PlaintextIdentity();
  }

  static Sha256(): Sha256Identity {
    return new Sha256Identity();
  }

  static ElGamal(): ElgamalIdentity {
    return new ElgamalIdentity();
  }

  static Semaphore(): SemaphoreIdentity {
    return new SemaphoreIdentity();
  }
}
