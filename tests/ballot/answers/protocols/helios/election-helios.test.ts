import { assertEquals, assertObjectMatch } from "jsr:@std/assert";
import { ElectionHelios } from "../../../../../src/ballot/index.ts";
import {
  ELECTION_DATA,
  EXPECTED_HASH,
  HELIOS_ELECTION_DATA,
  PUBLIC_KEY,
} from "./data.ts";

Deno.test("ElectionHelios::makeHash", async () => {
  const hash = await ElectionHelios.makeHash(ELECTION_DATA, PUBLIC_KEY);

  assertEquals(hash, EXPECTED_HASH);
});

Deno.test("ElectionHelios::modelFromHelios", async () => {
  const election = await ElectionHelios.modelFromHelios(HELIOS_ELECTION_DATA);

  assertObjectMatch(
    election,
    ELECTION_DATA as unknown as Record<string, unknown>,
  );

  const hash = await ElectionHelios.makeHash(ELECTION_DATA, PUBLIC_KEY);
  assertEquals(hash, EXPECTED_HASH);
});
