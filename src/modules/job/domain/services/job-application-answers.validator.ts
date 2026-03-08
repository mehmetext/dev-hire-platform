import { JobQuestion } from '../entities/job-question.entity';
import { JobQuestionType } from '../enums/job-question-type.enum';
import {
  InvalidJobQuestionAnswerError,
  MissingRequiredJobQuestionAnswerError,
} from '../errors';

export class JobApplicationAnswersValidator {
  static validate(
    questions: JobQuestion[],
    answers: { jobQuestionId: string; answer: string }[],
  ): void {
    const answerByQuestionId = new Map<string, string>();
    for (const a of answers) {
      const trimmed = a.answer?.trim();
      if (trimmed !== undefined) {
        answerByQuestionId.set(a.jobQuestionId, trimmed);
      }
    }

    for (const q of questions) {
      const answer = answerByQuestionId.get(q.id);

      if (q.isRequired && (answer === undefined || answer === '')) {
        throw new MissingRequiredJobQuestionAnswerError(q.question);
      }

      if (answer === undefined || answer === '') {
        continue;
      }

      switch (q.questionType) {
        case JobQuestionType.BOOLEAN: {
          const upper = answer.toUpperCase();
          if (upper !== 'TRUE' && upper !== 'FALSE') {
            throw new InvalidJobQuestionAnswerError(
              q.question,
              'Must be TRUE or FALSE',
            );
          }
          break;
        }
        case JobQuestionType.NUMBER: {
          if (Number.isNaN(Number(answer))) {
            throw new InvalidJobQuestionAnswerError(
              q.question,
              'Must be a valid number',
            );
          }
          break;
        }
        case JobQuestionType.TEXT:
        case JobQuestionType.TEXTAREA:
          break;
      }
    }
  }
}
