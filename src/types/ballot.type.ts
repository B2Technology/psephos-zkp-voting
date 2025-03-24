import type {
  PshAnswerProtocolEnum,
  PshIdentityProtocolEnum,
} from "./enums.ts";

export interface IAnswers<A> {
  proofs: A[];
  protocol: PshAnswerProtocolEnum;
}

export interface IIdentity<I> {
  proof: I;
  protocol: PshIdentityProtocolEnum;
}

export interface IBallot<A, I> {
  /**
   * Registra os votos do eleitor
   * Como: cada objeto da lista `answers` é uma resposta a uma pergunta, que foi criptografada com a chave pública da eleição
   * Garante: as provas contidas no objeto, demonstra que é um voto válido e sem duplicação de escolhas
   */
  answers: IAnswers<A>[];

  /**
   * Garante: que o eleitor esta habilitado a votar, sem revelar sua identidade (anonimato)
   * Como: alguma prova de que o eleitor esta na merkle tree
   * Unique: cada prova contem um `nullifier` diferente impedindo que o eleitor vote mais de uma vez
   */
  identity: IIdentity<I>;

  /**
   * Garante: que nao sera alterado mais nada no `answers`
   * Como: concatena os hashes das respostas e gera um hash SHA256
   * Unique: cada `answers` contem um nonce diferente, forçando hash diferentes, impedindo a reutilização da mesma `ballot_hash`
   */
  ballot_hash: string;

  /**
   * Garante: que q a cédula foi gerado por aplicativo homologado que possuir permissão para gerar cédulas
   * Como: cada eleição tera sua propria ApiKey, que sera usada para assinar o `ballot_hash` e `election_hash`, ex: `sha256(ballot_hash + election_hash + apiKey)`
   */
  app_signature: string;

  /**
   * Garante: que a cédula foi gerada baseada nos mesmos parametros de eleição do q os demais votantes
   * Todas as cedulas precisam ter o mesmo hash de eleição, caso contrario significa q a cedula foi gerada com parametros diferentes
   *
   * Como: gera um hash SHA256 do objeto eleição
   */
  election_hash: string;

  /**
   * Garante: que a cédula foi gerada para a eleição correta
   * Como: ID da eleição
   */
  election_uuid: string;
}
