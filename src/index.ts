import { Plaintext } from "npm:@psephos/elgamal";
import { BigInteger } from "npm:@psephos/elgamal/utils";

// TODO refactor

const s = Plaintext.fromBigInteger("123");

console.log("Plaintext =>", s);
console.log("Big1 =>", BigInteger.ONE);

export function PshGeneratorFactory(): void {
  // return new PshGenerator();
  throw new Error("Not implemented yet");
}
