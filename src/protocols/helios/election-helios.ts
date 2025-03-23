import type { PublicKey } from "@psephos/elgamal";
import type { IElection } from "../../types/index.ts";
import type { IQuestion } from "../../types/index.ts";

export class ElectionHelios {
  // deno-lint-ignore no-explicit-any
  static questionFromHelios(q: Record<string, any>): IQuestion {
    return {
      answer_urls: q.answer_urls,
      answers: q.answers,
      choice_type: q.choice_type,
      max: q.max,
      min: q.min,
      question: q.question,
      randomize_answer_order: q.randomize_answer_order,
      result_type: q.result_type,
      short_name: q.short_name,
      tally_type: q.tally,
    };
  }

  // deno-lint-ignore no-explicit-any
  static modelFromHelios(e: Record<string, any>): IElection {
    return {
      uuid: e.uuid,
      description: e.description,
      short_name: e.short_name,
      name: e.name,
      // deno-lint-ignore no-explicit-any
      questions: e.questions.map((q: Record<string, any>) =>
        ElectionHelios.questionFromHelios(q)
      ),
      cast_url: e.cast_url,
      frozen_at: e.frozen_at,
      openreg: e.openreg,
      voters_hash: e.voters_hash || null,
      use_voter_aliases: e.use_voter_aliases,
      voting_starts_at: e.voting_starts_at,
      voting_ends_at: e.voting_ends_at,
      election_hash: e.election_hash,
    };
  }

  static makeHash(e: IElection, publicKey: PublicKey): Promise<string> {
    const pk = publicKey.toJSON();

    const stringify = (dt: unknown): string =>
      JSON.stringify(dt).replaceAll('","', '", "');

    const template = [
      "{" +
      `"cast_url": "${e.cast_url}", ` +
      `"description": "${e.description}", ` +
      `"frozen_at": "${e.frozen_at}", ` +
      `"name": "${e.name}", ` +
      `"openreg": ${e.openreg}, ` +
      `"public_key": {"g": "${pk.g}", "p": "${pk.p}", "q": "${pk.q}", "y": "${pk.y}"}, ` +
      '"questions": [' +
      e.questions.map((question) =>
        "{" +
        `"answer_urls": ${stringify(question.answer_urls)}, ` +
        `"answers": ${stringify(question.answers)}, ` +
        `"choice_type": "${question.choice_type}", ` +
        `"max": ${question.max}, ` +
        `"min": ${question.min}, ` +
        `"question": "${question.question}", ` +
        `"randomize_answer_order": ${question.randomize_answer_order}, ` +
        `"result_type": "${question.result_type}", ` +
        `"short_name": "${question.short_name}", ` +
        `"tally_type": "${question.tally_type}"` +
        "}"
      ).join(", ") +
      "], " +
      `"short_name": "${e.short_name}", ` +
      `"use_voter_aliases": ${e.use_voter_aliases}, ` +
      `"uuid": "${e.uuid}", ` +
      `"voters_hash": ${e.voters_hash ? `"${e.voters_hash}"` : null}, ` +
      `"voting_ends_at": "${e.voting_ends_at}", ` +
      `"voting_starts_at": "${e.voting_starts_at}"` +
      "}",
    ].join("");

    return ElectionHelios.b64_sha256(template);
  }

  static async b64_sha256(stringToHash: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToHash);

    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);

    const hashBase64 = btoa(
      String.fromCharCode.apply(
        null,
        new Uint8Array(hashBuffer) as unknown as number[],
      ),
    );

    return hashBase64.replace(/=+$/, "");
  }
}
