#!/usr/bin/env -S deno run --allow-net --allow-read
import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/select.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import { PublicKey, type PublicKeyJSON } from "https://jsr.io/@psephos/elgamal/1.0.10/src/index.ts";
import type { IElectionHelios } from "../src/protocols/helios/types.ts";
import { ElectionHelios } from "../src/protocols/helios/election-helios.ts";
import { BallotFactory } from "../src/ballot/index.ts";

/**
 * Função principal
 */
async function main() {
  console.clear();
  console.log(colors.bold.green("Ballot Generator for Helios Voting"));
  console.log(colors.dim("=========================================\n"));

  // Obter ID da eleição
  const electionId = await Input.prompt({
    message: "Digite o ID da eleição:",
    validate: (input) => input.trim() !== "" || "O ID não pode estar vazio",
    default: "b3b99f04-fed2-11ee-9eff-2a72e601f5ab",
  });

  // Mostrar mensagem de carregamento
  console.log(colors.yellow("\nBuscando informações da eleição..."));

  try {
    // Fazer a requisição para o endpoint Helios
    const response = await fetch(
      `https://vote.heliosvoting.org/helios/elections/${electionId}`,
    );

    // Verificar se a requisição foi bem-sucedida
    if (!response.ok) {
      console.log(
        colors.bold.red(`\nErro: ${response.status} - ${response.statusText}`),
      );
      if (response.status === 404) {
        console.log(
          colors.red(
            "Eleição não encontrada. Verifique o ID e tente novamente.",
          ),
        );
      }
      Deno.exit(1);
    }

    // Transformar resposta em JSON
    const electionData: IElectionHelios = await response.json();

    const PUBLIC_KEY = PublicKey.fromJSON(electionData.public_key as PublicKeyJSON);
    const ELECTION = ElectionHelios.modelFromHelios(electionData);
    const protocol = BallotFactory.Helios(ELECTION, PUBLIC_KEY);

    // Exibir informações da eleição
    console.log(colors.bold.green("\nEleição encontrada:"));
    console.log(colors.cyan(`Nome: ${electionData.name}`));
    console.log(colors.cyan(`Descrição: ${electionData.description}`));
    console.log(colors.cyan(`UUID: ${electionData.uuid}`));
    console.log(
      colors.cyan(`Início da votação: ${electionData.voting_starts_at}`),
    );
    console.log(colors.cyan(`Fim da votação: ${electionData.voting_ends_at}`));

    // Mostrar perguntas disponíveis
    console.log(colors.bold.green("\nQuestões disponíveis:"));

    for (let i = 0; i < electionData.questions.length; i++) {
      const question = electionData.questions[i];
      console.log(colors.bold.cyan(`\nQuestão ${i + 1}: ${question.question}`));
      console.log(colors.dim(`Tipo de escolha: ${question.choice_type}`));
      console.log(
        colors.dim(`Mínimo: ${question.min}, Máximo: ${question.max}`),
      );

      console.log(colors.bold("\nOpções:"));
      for (let j = 0; j < question.answers.length; j++) {
        console.log(colors.white(`  ${j + 1}. ${question.answers[j]}`));
      }
    }

    // Array para armazenar as respostas selecionadas para cada questão
    const selectedAnswers: { questionIndex: number; answerText: string }[] = [];

    // Loop interativo para responder todas as questões
    for (
      let questionIndex = 0;
      questionIndex < electionData.questions.length;
      questionIndex++
    ) {
      const currentQuestion = electionData.questions[questionIndex];

      console.log(
        colors.bold.cyan(
          `\n\nResponda a Questão ${
            questionIndex + 1
          }: ${currentQuestion.question}`,
        ),
      );

      // Obter resposta para a questão atual
      const answerIndex = await Select.prompt<number>({
        message: `Selecione uma resposta:`,
        options: currentQuestion.answers.map((answer, idx) => ({
          name: answer,
          value: idx,
        })),
      });

      const selectedAnswer = currentQuestion.answers[answerIndex];
      selectedAnswers.push({
        questionIndex,
        answerText: selectedAnswer,
      });

      // Define a resposta para a questão atual no protocolo
      protocol.setAnswers(questionIndex, [selectedAnswer]);

      console.log(colors.green(`✓ Resposta registrada: ${selectedAnswer}`));
    }

    // Após responder todas as questões, gerar o ballot
    console.log(colors.yellow("\nGerando ballot com todas as respostas..."));

    try {
      // Gerar o objeto auditável após todas as questões terem sido respondidas
      const ballotHelios = await protocol.toAuditableHeliosObject();

      console.log(colors.bold.green("\nBallot gerado com sucesso!"));
      console.log(colors.dim("\nRespostas selecionadas:"));

      // Exibir um resumo das respostas selecionadas
      for (const answer of selectedAnswers) {
        const q = electionData.questions[answer.questionIndex];
        console.log(colors.cyan(`Questão: ${q.question}`));
        console.log(colors.white(`Resposta: ${answer.answerText}\n`));
      }

      console.log(colors.dim("\nDetalhes do ballot:"));
      console.log(JSON.stringify(ballotHelios));

      console.log(colors.bold.green("\nProcesso concluído com sucesso!"));
    } catch (error) {
      console.log(colors.bold.red("\nErro ao gerar o ballot:"));
      if (error instanceof Error) {
        console.log(colors.red(error.message));
      } else {
        console.log(colors.red(String(error)));
      }
    }
  } catch (error) {
    console.log(colors.bold.red("\nErro ao acessar a API:"));

    if (error instanceof Error) {
      console.log(colors.red(error.message));
    } else {
      console.log(colors.red(String(error)));
    }

    Deno.exit(1);
  }
}

// Executar função principal
main().catch(console.error);
