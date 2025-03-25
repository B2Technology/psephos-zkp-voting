import {
  type IIdentityGenerate,
  PshIdentityProtocolEnum,
} from "../../types/index.ts";
import { SemaphoreIdentity } from "./protocols/semaphore-identity.ts";
import { PsephosRSAIdentity } from "./protocols/psephos-rsa-identity.ts";
import { PlaintextIdentity } from "./protocols/plaintext-identity.ts";
import { Sha256Identity } from "./protocols/sha256-identity.ts";

export class PshIdentityFactory {
  static make(
    protocol: PshIdentityProtocolEnum,
  ): IIdentityGenerate<unknown> {
    switch (protocol) {
      case PshIdentityProtocolEnum.Plaintext:
        return PshIdentityFactory.Plaintext();

      case PshIdentityProtocolEnum.Sha256:
        return PshIdentityFactory.Sha256();

      case PshIdentityProtocolEnum.PsephosRSA:
        return PshIdentityFactory.PsephosRSA();

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

  static PsephosRSA(): PsephosRSAIdentity {
    return new PsephosRSAIdentity();
  }

  static Semaphore(): SemaphoreIdentity {
    return new SemaphoreIdentity();
  }
}
