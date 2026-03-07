import { JobQuestionType } from '../../domain/enums/job-question-type.enum';

export class BulkUpdateJobQuestionItemCommand {
  constructor(
    public readonly id: string,
    public readonly question?: string,
    public readonly questionType?: JobQuestionType,
    public readonly isRequired?: boolean,
    public readonly sortOrder?: number,
  ) {}
}

export class BulkUpdateJobQuestionsCommand {
  constructor(
    public readonly jobId: string,
    public readonly companyProfileId: string,
    public readonly questions: BulkUpdateJobQuestionItemCommand[],
  ) {}
}
