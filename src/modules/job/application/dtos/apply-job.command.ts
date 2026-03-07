import { CreateJobQuestionAnswerCommand } from './create-job-question-answer.command';

export class ApplyJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly candidateProfileId: string,
    public readonly candidateCVId: string,
    public readonly jobQuestionAnswers: CreateJobQuestionAnswerCommand[],
  ) {}
}
