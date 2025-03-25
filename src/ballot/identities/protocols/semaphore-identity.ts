import {
  generateProof,
  Group,
  Identity,
  type MerkleProof,
  type SemaphoreProof,
} from "@semaphore-protocol/core";
import type { IIdentity, IIdentityGenerate } from "../../../types/index.ts";
import { PshIdentityProtocolEnum } from "../../../types/index.ts";

export class SemaphoreIdentity implements IIdentityGenerate<SemaphoreProof> {
  private _secret: string | null = null;
  private _scope: string | null = null;
  private _ballotHash: string | null = null;
  private _merkleProof: MerkleProof | null = null;

  setSecret(txt: string): void {
    this._secret = txt.trim();
  }

  setScope(scope: string): void {
    this._scope = scope;
  }

  setBallotHash(hash: string): void {
    this._ballotHash = hash;
  }

  setMerkleProof(merkleProof: MerkleProof): void {
    this._merkleProof = merkleProof;
  }

  getIdentity(): Identity {
    if (!this._secret) {
      throw new Error("Secret not set");
    }

    return new Identity(this._secret);
  }

  getScope(): string {
    if (!this._scope) {
      throw new Error("Scope not set");
    }

    return this._scope;
  }

  getMessage(): string {
    if (!this._ballotHash) {
      throw new Error("Ballot Hash not set");
    }

    return this._ballotHash.slice(0, 12) + "..." +
      this._ballotHash.slice(-12);
  }

  getMerkleProof(): MerkleProof {
    if (!this._merkleProof) {
      throw new Error("Merkle Proof not set");
    }

    return this._merkleProof;
  }

  async generate(): Promise<IIdentity<SemaphoreProof>> {
    const scope = this.getScope();
    const identity = this.getIdentity();
    const message = this.getMessage();
    const merkleProof = this.getMerkleProof();

    const proof = await generateProof(
      identity,
      merkleProof,
      message,
      scope,
    );

    return {
      proof,
      protocol: PshIdentityProtocolEnum.Semaphore,
    };
  }

  /**
   * Este metodo é apenas de teste!
   * Mostra como é gerado uma prova de Merkle do lado backend
   */
  simulateMerkleProof(): MerkleProof {
    const identity = this.getIdentity();

    const group = new Group();
    group.addMember(identity.commitment);

    const index = group.indexOf(identity.commitment);
    return group.generateMerkleProof(index);
  }
}
