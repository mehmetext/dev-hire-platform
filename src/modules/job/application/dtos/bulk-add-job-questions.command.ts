import { CreateJobQuestionCommand } from './create-job-question.command';

export class BulkAddJobQuestionsCommand {
  constructor(
    public readonly jobId: string,
    public readonly companyProfileId: string,
    public readonly questions: CreateJobQuestionCommand[],
  ) {}
}
