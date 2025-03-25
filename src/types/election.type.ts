import type {
  PshAnswerProtocolEnum,
  PshIdentityProtocolEnum,
} from "./enums.ts";

// TODO refactor padrao camelCase
// TODO refactor remover campos nao utilizados

export interface IPshQuestion {
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

export interface IPshElection {
  uuid: string;
  description: string;
  short_name: string;
  name: string;
  questions: Array<IPshQuestion>;
  cast_url: string;
  frozen_at: string;
  openreg: boolean;
  voters_hash: string | null;
  election_hash: string | null;
  use_voter_aliases: boolean;
  voting_starts_at: string;
  voting_ends_at: string;
  identity_protocol: PshIdentityProtocolEnum;
  answer_protocol: PshAnswerProtocolEnum;
}
