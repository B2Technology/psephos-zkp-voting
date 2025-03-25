import type { ZKProofJSON } from "@psephos/elgamal";
import {
  type IAnswerGenerate,
  type IAnswers,
  PshAnswerProtocolEnum,
} from "../../../../types/index.ts";
import { AnswerElgamal } from "../elgamal/answer-elgamal.ts";
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

export class AnswerHelios extends AnswerElgamal implements IAnswerGenerate {
  override getProtocol(): PshAnswerProtocolEnum {
    return PshAnswerProtocolEnum.Helios;
  }

  async toAuditableHeliosObject(): Promise<
    IBallotHelios<IAnswerAuditableHelios>
  > {
    const result = await this.generateAuditable();

    return {
      answers: result.proofs.map((as) =>
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
    const result = await this.generate();

    return {
      answers: result.proofs.map((as) => this.transformAnswerToHelios(as)),
      election_hash: await ElectionHelios.makeHash(
        this.election,
        this.publicKey,
      ),
      election_uuid: this.election.uuid,
    };
  }

  override async generate(): Promise<IAnswers<IAnswerHelios>> {
    const answers = await this._encryptAnswers();
    const proofs = answers.map((a) => a.toObject());

    return {
      proofs,
      hashes: await this.appendedHashes(proofs),
      protocol: this.getProtocol(),
    };
  }

  override async generateAuditable(): Promise<
    IAnswers<IAnswerAuditableHelios>
  > {
    const answers = await this._encryptAnswers();
    const proofs = answers.map((a) => a.toAuditableObject());

    return {
      proofs,
      hashes: await this.appendedHashes(proofs),
      protocol: this.getProtocol(),
    };
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
