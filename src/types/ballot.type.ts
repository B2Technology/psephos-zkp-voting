import type { PshProtocolEnum } from "./enums.ts";

export interface IBallot<T> {
  answers: T[];
  ballot_hash: string; // (garante q nao sera alterado mais nada no answers) concatena os hashes das respostas e gera um hash SHA256
  voter_proof: string; // (prova de forma anonoma q o vontante esta habilitado) algum tipo de prova, pra validar q o eleitor esta na merkletree (de forma anonima)
  app_signature: string; // (prova q quem gerou a cedula, foi um serviço autorizado) algum tipo de prova, pra provar q a cedula foi assinada pelo cliente homologado (essa assinatura ja é feita no backend do cliente
  election_hash: string; // (prova q a cedula foi gerada baseada nos mesmos parametros de eleição do q os demais votantes) // Todas as cedulas precisam ter o mesmo hash de eleição, caso contrario significa q a cedula foi gerada com parametros diferentes
  election_uuid: string; // ID da eleição
  protocol: PshProtocolEnum;
}
