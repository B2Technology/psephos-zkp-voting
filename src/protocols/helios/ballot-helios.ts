import type { ZKProofJSON } from "@psephos/elgamal";
import {
  type IBallot,
  type IBallotGenerate,
  PshProtocolEnum,
} from "../../types/index.ts";
import { BallotElGamal } from "../elgamal/ballot-elgamal.ts";
import type {
  IAnswerAuditableElGamal,
  IAnswerElGamal,
} from "../elgamal/types.ts";
import { ElectionHelios } from "./election-helios.ts";
import type {
  IAnswerAuditableHelios,
  IAnswerHelios,
  IBallotHelios,
  ProofHelios,
} from "./types.ts";

export class BallotHelios extends BallotElGamal implements IBallotGenerate {
  override getProtocol(): PshProtocolEnum {
    return PshProtocolEnum.Helios;
  }

  async toAuditableHeliosObject(): Promise<
    IBallotHelios<IAnswerAuditableHelios>
  > {
    const result = await this._generate(true);

    return {
      answers: result.answers.map((as) =>
        this.transformAnswerToHelios(as, true) as IAnswerAuditableHelios
      ),
      election_hash: await ElectionHelios.makeHash(
        this.election,
        this.publicKey,
      ),
      election_uuid: this.election.uuid,
    };
  }

  async toHeliosObject(): Promise<IBallotHelios<IAnswerHelios>> {
    const result = await this._generate(false);

    return {
      answers: result.answers.map((as) => this.transformAnswerToHelios(as)),
      election_hash: await ElectionHelios.makeHash(
        this.election,
        this.publicKey,
      ),
      election_uuid: this.election.uuid,
    };
  }

  override generate(): Promise<IBallot<IAnswerHelios>> {
    return this._generate(false);
  }

  override async generateAuditable(): Promise<IBallot<IAnswerAuditableHelios>> {
    const result = await this._generate(true);
    return result as IBallot<IAnswerAuditableHelios>;
  }

  private transformAnswerToHelios(
    as: IAnswerElGamal | IAnswerAuditableElGamal,
    auditable = false,
  ): IAnswerHelios | IAnswerAuditableHelios {
    const obj: IAnswerHelios = {
      choices: as.choices.map((c) => ({
        alpha: c.alpha.toString(),
        beta: c.beta.toString(),
      })),
      individual_proofs: as.individual_proofs.map((p) =>
        p.map((pr) => this.transformProofToHelios(pr))
      ),
      overall_proof: as.overall_proof.map((pr) =>
        this.transformProofToHelios(pr)
      ),
    };

    if (auditable) {
      const asAuditable = as as IAnswerAuditableElGamal;
      return {
        ...obj,
        answer: asAuditable.answer,
        randomness: asAuditable.randomness.map((r) => r.toString()),
      } as IAnswerAuditableHelios;
    }

    return obj;
  }

  private transformProofToHelios(proof: ZKProofJSON): ProofHelios {
    return {
      challenge: proof.challenge.toString(),
      commitment: {
        A: proof.commitment.A.toString(),
        B: proof.commitment.B.toString(),
      },
      response: proof.response.toString(),
    };
  }
}
