// TODO refactor padrao camelCase
// TODO refactor remover campos nao utilizados

export interface IQuestion {
  answer_urls: Array<string>;
  answers: Array<string>;
  choice_type: string;
  max: number;
  min: number;
  question: string;
  randomize_answer_order: boolean;
  result_type: "absolute";
  short_name: string;
  tally_type: "homomorphic";
}

export interface IElection {
  uuid: string;
  description: string;
  short_name: string;
  name: string;
  questions: Array<IQuestion>;
  cast_url: string;
  frozen_at: string;
  openreg: boolean;
  voters_hash: string | null;
  use_voter_aliases: boolean;
  voting_starts_at: string;
  voting_ends_at: string;
  election_hash?: string;
}
