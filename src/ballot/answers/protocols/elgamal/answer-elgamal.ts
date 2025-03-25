import type {
  Ciphertext,
  PublicKey,
  ZKDisjunctiveProof,
} from "@psephos/elgamal";
import {
  type BigInteger,
  disjunctiveChallengeGenerator,
  generatePlaintexts,
  randomMpzLt,
} from "@psephos/elgamal/utils";
import type {
  IAnswerGenerate,
  IAnswers,
  IPshElection,
  IPshQuestion,
} from "../../../../types/index.ts";
import { PshAnswerProtocolEnum } from "../../../../types/index.ts";
import { AnswerBase } from "../base/answer-base.ts";
import type { IAnswerAuditableElGamal, IAnswerElGamal } from "./types.ts";
import { EncryptedAnswerElgamal } from "./encrypted-answer-elgamal.ts";

// TODO copiar alguns metodos para Interface

export class AnswerElgamal extends AnswerBase
  implements IAnswerGenerate<IAnswerElGamal> {
  protected readonly publicKey: PublicKey;

  constructor(
    election: IPshElection,
    publicKey: PublicKey,
  ) {
    super(election);
    this.publicKey = publicKey;
  }

  getProtocol(): PshAnswerProtocolEnum {
    return PshAnswerProtocolEnum.ElGamal;
  }

  async generate(): Promise<IAnswers<IAnswerElGamal>> {
    const answers = await this._encryptAnswers();
    const proofs = answers.map((a) => a.toObject());

    return {
      proofs,
      hashes: await this.appendedHashes(proofs),
      protocol: this.getProtocol(),
    };
  }

  async generateAuditable(): Promise<IAnswers<IAnswerAuditableElGamal>> {
    const answers = await this._encryptAnswers();
    const proofs = answers.map((a) => a.toAuditableObject());

    return {
      proofs,
      hashes: await this.appendedHashes(proofs),
      protocol: this.getProtocol(),
    };
  }

  protected async _encryptAnswers(
    randomness?: BigInteger[],
  ): Promise<EncryptedAnswerElgamal[]> {
    const answers = this.getAnswers();
    const ballot: EncryptedAnswerElgamal[] = [];

    for (const index in this.election.questions) {
      const question = this.election.questions[index];
      const answer = answers[index];

      ballot[index] = await this._doEncryption(
        question,
        answer,
        randomness,
      );
    }

    return ballot;
  }

  protected async _doEncryption(
    question: IPshQuestion,
    answer: number[],
    randomness?: BigInteger[],
  ): Promise<EncryptedAnswerElgamal> {
    const choices: Ciphertext[] = [];
    const individual_proofs: ZKDisjunctiveProof[] = [];
    let overall_proof: ZKDisjunctiveProof;

    // possible plaintexts
    const plaintexts = question.max != null
      ? generatePlaintexts(this.publicKey, question.min, question.max)
      : generatePlaintexts(this.publicKey, 0, 1);

    const zero_one_plaintexts = generatePlaintexts(this.publicKey, 0, 1);

    // keep track of whether we need to generate new randomness
    let generate_new_randomness = false;
    if (randomness?.length && randomness.length !== question.answers.length) {
      throw new Error(
        "randomness length does not match question answers length",
      );
    } else if (!randomness) {
      randomness = [];
      generate_new_randomness = true;
    }

    // keep track of number of options selected.
    let num_selected_answers = 0;

    // go through each possible answer and encrypt either a g^0 or a g^1.
    for (let i = 0; i < question.answers.length; i++) {
      let plaintext_index;

      // if this is the answer, swap them so m is encryption 1 (g)
      if (answer.includes(i)) {
        plaintext_index = 1;
        num_selected_answers += 1;
      } else {
        plaintext_index = 0;
      }

      // generate randomness?
      if (generate_new_randomness) {
        randomness[i] = await randomMpzLt(this.publicKey.q);
      }

      choices[i] = this.publicKey.encryptWithR(
        zero_one_plaintexts[plaintext_index],
        randomness[i],
      );

      // generate proof
      if (generate_new_randomness) {
        // generate proof that this ciphertext is a 0 or a 1
        individual_proofs[i] = await choices[
          i
        ].generateDisjunctiveEncryptionProof(
          zero_one_plaintexts,
          plaintext_index,
          randomness[i],
          disjunctiveChallengeGenerator,
        );
      }
    }

    if (generate_new_randomness && question.max != null) {
      // we also need proof that the whole thing sums up to the right number
      // only if max is non-null, otherwise it's full approval voting

      // compute the homomorphic sum of all the options
      let hom_sum = choices[0];
      let rand_sum = randomness[0];
      for (let i = 1; i < question.answers.length; i++) {
        hom_sum = hom_sum.multiply(choices[i]);
        rand_sum = rand_sum.add(randomness[i]).mod(this.publicKey.q);
      }

      // prove that the sum is 0 or 1 (can be "blank vote" for this answer)
      // num_selected_answers is 0 or 1, which is the index into the plaintext that is actually encoded
      //
      // now that "plaintexts" only contains the array of plaintexts that are possible starting with min
      // and going to max, the num_selected_answers needs to be reduced by min to be the proper index
      let overall_plaintext_index = num_selected_answers;
      if (question.min) overall_plaintext_index -= question.min;

      overall_proof = await hom_sum.generateDisjunctiveEncryptionProof(
        plaintexts,
        overall_plaintext_index,
        rand_sum,
        disjunctiveChallengeGenerator,
      );
    }

    return new EncryptedAnswerElgamal(
      choices,
      individual_proofs,
      overall_proof!,
      randomness,
      answer,
    );
  }
}
