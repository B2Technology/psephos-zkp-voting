import type { IIdentity, IIdentityGenerate } from "../../../types/index.ts";
import { PshIdentityProtocolEnum } from "../../../types/index.ts";
import { sha256 } from "../../../utils/index.ts";

export class Sha256Identity implements IIdentityGenerate {
  private _secret: string | null = null;
  private _electionUUID: string | null = null;

  setSecret(txt: string): void {
    this._secret = txt.trim();
  }

  setElectionUUID(uuid: string): void {
    this._electionUUID = uuid;
  }

  async generate(): Promise<IIdentity<string>> {
    if (!this._secret) {
      throw new Error("Secret not set");
    }

    if (!this._electionUUID) {
      throw new Error("Election UUID not set");
    }

    const proof = await sha256(`${this._secret}:${this._electionUUID}`);

    return {
      proof,
      protocol: PshIdentityProtocolEnum.Sha256,
    };
  }
}
