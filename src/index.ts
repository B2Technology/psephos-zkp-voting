import { Plaintext } from "@psephos/elgamal";
import { BigInteger } from "@psephos/elgamal/utils";

// TODO refactor

console.log("Plaintext =>", Plaintext.fromBigInteger("123"));
console.log("Big1 =>", BigInteger.ONE);

export function PshGeneratorFactory(): void {
  // return new PshGenerator();
  throw new Error("Not implemented yet");
}
