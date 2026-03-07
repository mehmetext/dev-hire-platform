import { Inject } from '@nestjs/common';
import { JobNotFoundError } from '../../domain/errors';
import { BulkDeleteJobQuestionsCommand } from '../dtos/bulk-delete-job-questions.command';
import { JobRepository } from '../repositories/job.repository';

export class BulkDeleteJobQuestionsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: BulkDeleteJobQuestionsCommand): Promise<void> {
    const job = await this.jobRepository.findById(command.jobId);
    if (!job) {
      throw new JobNotFoundError();
    }
    job.assertOwnedBy(command.companyProfileId);
    await this.jobRepository.deleteQuestions(
      command.jobId,
      command.questionIds,
    );
  }
}
