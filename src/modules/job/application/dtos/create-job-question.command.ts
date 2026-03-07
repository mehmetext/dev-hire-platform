import { JobQuestionType } from '../../domain/enums/job-question-type.enum';

export class CreateJobQuestionCommand {
  constructor(
    public readonly question: string,
    public readonly questionType: JobQuestionType,
    public readonly isRequired: boolean,
    public readonly sortOrder: number,
  ) {}
}
