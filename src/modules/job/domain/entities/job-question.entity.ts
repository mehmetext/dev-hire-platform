import { JobQuestionType } from '../enums/job-question-type.enum';
import { JobQuestionAnswer } from './job-question-answer.entity';
import { Job } from './job.entity';

export class JobQuestion {
  constructor(
    public readonly id: string,
    public readonly jobId: string,
    public readonly question: string,
    public readonly questionType: JobQuestionType,
    public readonly isRequired: boolean,
    public readonly sortOrder: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
    public readonly job?: Job,
    public readonly jobQuestionAnswers?: JobQuestionAnswer[],
  ) {}

  static create(params: {
    id: string;
    jobId: string;
    question: string;
    questionType: JobQuestionType;
    isRequired: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
    job?: Job;
    jobQuestionAnswers?: JobQuestionAnswer[];
  }): JobQuestion {
    return new JobQuestion(
      params.id,
      params.jobId,
      params.question,
      params.questionType,
      params.isRequired,
      params.sortOrder,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
      params.job ?? undefined,
      params.jobQuestionAnswers?.map((jobQuestionAnswer) =>
        JobQuestionAnswer.create(jobQuestionAnswer),
      ),
    );
  }
}
