import { assertEquals } from "jsr:@std/assert";
import { objectToSha256, sha256 } from "../../src/utils/index.ts";

Deno.test("Helpers::sha256", async () => {
  const hash = await sha256("hello");

  assertEquals(
    hash,
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  );
});

Deno.test("Helpers::objectToSha256", async () => {
  const hash = await objectToSha256({ foo: "bar" });

  assertEquals(
    hash,
    "7a38bf81f383f69433ad6e900d35b3e2385593f76a7b7ab5d4355b8ba41ee24b",
  );
});
