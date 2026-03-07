import { Inject } from '@nestjs/common';
import { JobQuestion } from '../../domain/entities/job-question.entity';
import { JobNotFoundError } from '../../domain/errors';
import { JobRepository } from '../repositories/job.repository';

export class GetJobQuestionsByJobIdUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(
    jobId: string,
    companyProfileId: string,
  ): Promise<JobQuestion[]> {
    const job = await this.jobRepository.findById(jobId, {
      includeJobQuestions: true,
    });
    if (!job) {
      throw new JobNotFoundError();
    }
    job.assertOwnedBy(companyProfileId);
    return job.jobQuestions ?? [];
  }
}
