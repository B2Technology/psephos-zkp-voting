import type { CiphertextCommitmentJSON, ZKProofJSON } from "@psephos/elgamal";

export interface IAnswerElGamal {
  choices: CiphertextCommitmentJSON[];
  individual_proofs: ZKProofJSON[][];
  overall_proof: ZKProofJSON[];
}

export interface IAnswerAuditableElGamal {
  choices: CiphertextCommitmentJSON[];
  individual_proofs: ZKProofJSON[][];
  overall_proof: ZKProofJSON[];
  randomness: string[];
  answer: number[];
}
