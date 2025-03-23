export interface CommitmentHelios {
  A: string;
  B: string;
}

export interface ProofHelios {
  challenge: string;
  commitment: CommitmentHelios;
  response: string;
}

export interface ChoiceHelios {
  alpha: string;
  beta: string;
}

export interface IAnswerHelios {
  choices: ChoiceHelios[];
  individual_proofs: ProofHelios[][];
  overall_proof: ProofHelios[];
}

export interface IAnswerAuditableHelios {
  choices: ChoiceHelios[];
  individual_proofs: ProofHelios[][];
  overall_proof: ProofHelios[];
  answer: number[];
  randomness: string[];
}

export interface IBallotHelios<T> {
  answers: T[];
  election_hash: string;
  election_uuid: string;
}
