import type { IIdentity, IIdentityGenerate } from "../../../types/index.ts";
import { PshIdentityProtocolEnum } from "../../../types/index.ts";
import { PshRSA } from "../../../utils/index.ts";

export class PsephosRSAIdentity implements IIdentityGenerate<string> {
  private _secret: string | null = null;
  private _publicKey: string | null = null;

  setSecret(txt: string): void {
    this._secret = txt.trim();
  }

  setPublicKey(publicKey: string): void {
    this._publicKey = publicKey;
  }

  async generate(): Promise<IIdentity<string>> {
    if (!this._secret) {
      throw new Error("Secret not set");
    }

    if (!this._publicKey) {
      throw new Error("Public key not set");
    }

    // TODO refatorar para receber uma instancia de uma classe RsaPublicKey (para evitar ficar sempre fazendo parse da chave PEM)
    const ciphertext = await PshRSA.encrypt(this._secret, this._publicKey);

    return {
      proof: ciphertext,
      protocol: PshIdentityProtocolEnum.PsephosRSA,
    };
  }
}
