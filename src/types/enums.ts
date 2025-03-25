export enum PshAnswerProtocolEnum {
  /**
   * Encripta o voto com a chave pública da eleição
   * Gerando uma prova de que o voto é válido e sem duplicação de escolhas
   *
   * Cedula contem outros elementos de segurança
   */
  ElGamal = "ElGamal",

  /**
   * Encripta o voto com a chave pública da eleição, no padrão Helios usando ElGamal
   * Gerando uma prova de que o voto é válido e sem duplicação de escolhas
   *
   * Não possui outros elementos de segurança
   *
   * Permite gerar uma cedula auditavel no HeliosVoting.com
   */
  Helios = "Helios",

  /**
   * Encripta o voto com a chave pública do Psephos, no padrão RSA
   * Nesse padrão o nivel de segurança é maior, muito mais dificil de ser quebrado, porem não temos provas de que o voto é válido e sem duplicação de escolhas
   * (nesses casos no momento da contagem votos invalidos sserão anulados)
   *
   * Cedula contem outros elementos de segurança
   */
  PsephosRSA = "PsephosRSA",

  /**
   * Voto em texto puro, sem encriptação (transparencia)
   * Nesse padrão o nivel de segurança é menor, qualquer um pode ver o voto do eleitor
   */
  Plaintext = "Plaintext",
}

/**
 * Como sera enviado o indetificado do eleitor para o servidor
 *
 * Obs: O identificador é utilizado sera um texto unico para cada eleitor, como por exemplo o CPF, email, wallet address, etc
 */
export enum PshIdentityProtocolEnum {
  /**
   * Gera uma prova de que o eleitor esta na merkle tree tornando o voto anonimo
   * Alem disso gera um `nullifier` para garantir que o eleitor não vote mais de uma vez
   */
  Semaphore = "Semaphore",

  /**
   * O ID do eleito é encriptado com a chave pública do Psephos, no padrão RSA
   * Apenas o servidor de votação tera acesso a essa informação, para poder validar se é um ID valido
   */
  PsephosRSA = "PsephosRSA",

  /**
   * segredo é transformado em SHA256 ex: `sha256(secret + : + election_uuid)`
   */
  Sha256 = "Sha256",

  /**
   * O ID do eleito é transmitido em texto puro
   */
  Plaintext = "Plaintext",
}
