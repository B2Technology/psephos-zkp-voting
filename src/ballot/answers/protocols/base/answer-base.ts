import type {
  IAnswerGenerate,
  IAnswers,
  IPshElection,
  PshAnswerProtocolEnum,
} from "../../../../types/index.ts";
import { objectToSha256 } from "../../../../utils/index.ts";

// TODO copiar alguns metodos para Interface

export abstract class AnswerBase implements IAnswerGenerate<unknown> {
  protected readonly answers: Map<number, number[]>; // question index -> answer index

  protected constructor(
    public readonly election: IPshElection,
  ) {
    this.answers = new Map();
  }

  abstract getProtocol(): PshAnswerProtocolEnum;

  abstract generate(): Promise<IAnswers<unknown>>;

  abstract generateAuditable(): Promise<IAnswers<unknown>>;

  getAnswer(questionIndex: number): number[] {
    return this.answers.get(questionIndex) || [];
  }

  getAnswers(): Array<number[]> {
    const answers: Array<number[]> = [];

    this.election.questions.forEach((_question, index) => {
      answers.push(this.getAnswer(index));
    });

    return answers;
  }

  setAnswers(questionIndex: number, answers: string[]) {
    const question = this.election.questions[questionIndex];
    if (!question) {
      throw new Error("Question not found");
    }

    const answersIndex = answers.map((a) => question.answers.indexOf(a));
    const hasInvalidAnswer = answersIndex.some((index) => index === -1);
    if (hasInvalidAnswer) {
      throw new Error(
        `Invalid answer! Available answers: ${question.answers.join(", ")}`,
      );
    }

    const hasDuplicateAnswer = answersIndex.some((index, i) =>
      answersIndex.indexOf(index) !== i
    );
    if (hasDuplicateAnswer) {
      throw new Error("Duplicate answer");
    }

    if (answersIndex.length < question.min) {
      throw new Error(
        `Invalid min answers: ${answers.length} < ${question.min}`,
      );
    }

    if (answersIndex.length > question.max) {
      throw new Error(
        `Invalid max answers: ${answers.length} > ${question.max}`,
      );
    }

    this.answers.set(questionIndex, answersIndex);
  }

  protected appendedHashes(proofs: unknown[]): Promise<string[]> {
    return Promise.all(proofs.map((p) => objectToSha256(p)));
  }
}
