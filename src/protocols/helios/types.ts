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

export interface IElectionHelios {
  uuid: string;
  name: string;
  short_name: string;
  description: string;
  cast_url: string;
  frozen_at: string;
  openreg: boolean;
  public_key: Record<string, string>;
  questions: Array<{
    question: string;
    short_name: string;
    answers: string[];
    answer_urls: string[];
    choice_type: string;
    max: number;
    min: number;
    tally_type: string;
    result_type: string;
    randomize_answer_order: boolean;
  }>;
  use_voter_aliases: boolean;
  voters_hash: string | null;
  election_hash?: string;
  voting_ends_at: string;
  voting_starts_at: string;
}
