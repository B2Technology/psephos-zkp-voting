import type { IIdentity, IIdentityGenerate } from "../../../types/index.ts";
import { PshIdentityProtocolEnum } from "../../../types/index.ts";

export class PlaintextIdentity implements IIdentityGenerate<string> {
  private _secret: string | null = null;

  setSecret(txt: string): void {
    this._secret = txt.trim();
  }

  generate(): Promise<IIdentity<string>> {
    if (!this._secret) {
      return Promise.reject(new Error("Secret not set"));
    }

    return Promise.resolve({
      protocol: PshIdentityProtocolEnum.Plaintext,
      proof: this._secret,
    });
  }
}
