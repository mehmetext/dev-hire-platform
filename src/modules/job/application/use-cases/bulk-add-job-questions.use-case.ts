import { Inject } from '@nestjs/common';
import { JobQuestion } from '../../domain/entities/job-question.entity';
import { JobNotFoundError } from '../../domain/errors';
import { BulkAddJobQuestionsCommand } from '../dtos/bulk-add-job-questions.command';
import { JobRepository } from '../repositories/job.repository';

export class BulkAddJobQuestionsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: BulkAddJobQuestionsCommand): Promise<JobQuestion[]> {
    const job = await this.jobRepository.findById(command.jobId);
    if (!job) {
      throw new JobNotFoundError();
    }
    job.assertOwnedBy(command.companyProfileId);
    return this.jobRepository.addQuestions(command.jobId, command.questions);
  }
}
