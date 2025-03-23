import type {
  IBallot,
  IBallotGenerate,
  IElection,
  PshProtocolEnum,
} from "../../types/index.ts";

// TODO copiar alguns metodos para Interface

export abstract class BallotBase implements IBallotGenerate {
  protected readonly answers = new Map<number, number[]>(); // question index -> answer index

  protected constructor(
    public readonly election: IElection,
  ) {
  }

  abstract getProtocol(): PshProtocolEnum;

  abstract generate(): Promise<IBallot<unknown>>;

  abstract generateAuditable(): Promise<IBallot<unknown>>;

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
      throw new Error("Invalid answer");
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
}
