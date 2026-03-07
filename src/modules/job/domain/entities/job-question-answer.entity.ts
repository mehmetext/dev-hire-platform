import { JobApplication } from './job-application.entity';
import { JobQuestion } from './job-question.entity';

export class JobQuestionAnswer {
  constructor(
    public readonly id: string,
    public readonly jobQuestionId: string,
    public readonly jobApplicationId: string,
    public readonly answer: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
    public readonly jobQuestion?: JobQuestion,
    public readonly jobApplication?: JobApplication,
  ) {}

  static create(params: {
    id: string;
    jobQuestionId: string;
    jobApplicationId: string;
    answer: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
    jobQuestion?: JobQuestion;
    jobApplication?: JobApplication;
  }): JobQuestionAnswer {
    return new JobQuestionAnswer(
      params.id,
      params.jobQuestionId,
      params.jobApplicationId,
      params.answer,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
      params.jobQuestion ? JobQuestion.create(params.jobQuestion) : undefined,
      params.jobApplication
        ? JobApplication.create(params.jobApplication)
        : undefined,
    );
  }
}
