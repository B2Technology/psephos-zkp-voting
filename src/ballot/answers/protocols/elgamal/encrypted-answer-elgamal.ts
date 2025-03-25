import type { Ciphertext, ZKDisjunctiveProof } from "@psephos/elgamal";
import type { BigInteger } from "@psephos/elgamal/utils";
import type { IAnswerAuditableElGamal, IAnswerElGamal } from "./types.ts";

export class EncryptedAnswerElgamal {
  constructor(
    public readonly choices: Array<Ciphertext>,
    public readonly individual_proofs: Array<ZKDisjunctiveProof>,
    public readonly overall_proof: ZKDisjunctiveProof,
    public readonly randomness: Array<BigInteger>,
    public readonly answer: number[],
  ) {}

  // clearPlaintexts() {
  //   this.answer = null;
  //   this.randomness = null;
  // }

  // FIXME: should verifyEncryption really generate proofs? Overkill.
  // async verifyEncryption(
  //   question: IQuestion,
  //   pk: PublicKey,
  // ): Promise<boolean> {
  //   const result = await AnswerHelios.fromQuestion(
  //     question,
  //     this.answer,
  //     pk,
  //     this.randomness,
  //   );
  //
  //   // check that we have the same number of ciphertexts
  //   if (result.choices.length != this.choices.length) {
  //     return false;
  //   }
  //
  //   // check the ciphertexts
  //   for (let i = 0; i < result.choices.length; i++) {
  //     if (!result.choices[i].equals(this.choices[i])) {
  //       // alert ("oy: " + result.choices[i] + "/" + this.choices[i]);
  //       return false;
  //     }
  //   }
  //
  //   // we made it, we're good
  //   return true;
  // }

  // toString(): string {
  //   // get each ciphertext as a JSON string
  //   const choices_strings = this.choices.map((c) => c.toString());
  //   return choices_strings.join("|");
  // }

  // static fromJSONObject(
  //   d: Record<string, any>,
  //   election: ElectionHelios,
  // ): EncryptedAnswerHelios {
  //   const choices = d.choices.map((choice) =>
  //     Ciphertext.fromData(choice, election.public_key)
  //   );
  //
  //   const individual_proofs = d.individual_proofs.map((p) =>
  //     ZKDisjunctiveProof.fromJsonProofs(p)
  //   );
  //
  //   const overall_proof = ZKDisjunctiveProof.fromJsonProofs(d.overall_proof);
  //
  //   // possibly load randomness and plaintext
  //   let randomness;
  //   let answer;
  //   if (d.randomness) {
  //     randomness = d.randomness.map((r) => new BigInteger(r));
  //     answer = d.answer;
  //   }
  //
  //   return new EncryptedAnswerHelios(
  //     choices,
  //     individual_proofs,
  //     overall_proof,
  //     randomness,
  //     answer,
  //   );
  // }

  toObject(): IAnswerElGamal {
    return {
      choices: this.choices.map((c) => c.toCommitmentJSON()),
      overall_proof: this.overall_proof?.toProofsJSON(),
      individual_proofs: this.individual_proofs.map(
        (p) => p.toProofsJSON(),
      ),
    };
  }

  toAuditableObject(): IAnswerAuditableElGamal {
    return {
      answers: this.answer,
      choices: this.choices.map((c) => c.toCommitmentJSON()),
      randomness: this.randomness.map((r) => r.toString()),
      overall_proof: this.overall_proof?.toProofsJSON(),
      individual_proofs: this.individual_proofs.map(
        (p) => p.toProofsJSON(),
      ),
    };
  }
}
