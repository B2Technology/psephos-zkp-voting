import {
  type CiphertextCommitmentJSON,
  Plaintext,
  type PublicKey,
} from "@psephos/elgamal";
import type { IIdentity, IIdentityGenerate } from "../../../types/index.ts";
import { PshIdentityProtocolEnum } from "../../../types/index.ts";

export class ElgamalIdentity implements IIdentityGenerate {
  private _secret: string | null = null;
  private _publicKey: PublicKey | null = null;

  setSecret(txt: string): void {
    this._secret = txt.trim();
  }

  setPublicKey(publicKey: PublicKey): void {
    this._publicKey = publicKey;
  }

  async generate(): Promise<IIdentity<CiphertextCommitmentJSON>> {
    if (!this._secret) {
      throw new Error("Secret not set");
    }

    if (!this._publicKey) {
      throw new Error("Public key not set");
    }

    const plaintext = await Plaintext.fromString(this._secret);
    const ciphertext = await this._publicKey.encrypt(plaintext);

    return {
      proof: ciphertext.toCommitmentJSON(),
      protocol: PshIdentityProtocolEnum.ElGamal,
    };
  }
}
