import type { IIdentity } from "./ballot.type.ts";

// TODO copiar os metodos da class
export interface IIdentityGenerate<I> {
  setSecret(txt: string): void;
  generate(): Promise<IIdentity<I>>;
}
