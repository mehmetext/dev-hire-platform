import { Inject } from '@nestjs/common';
import { JobQuestion } from '../../domain/entities/job-question.entity';
import { JobNotFoundError } from '../../domain/errors';
import { BulkUpdateJobQuestionsCommand } from '../dtos/bulk-update-job-questions.command';
import { JobRepository } from '../repositories/job.repository';

export class BulkUpdateJobQuestionsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(
    command: BulkUpdateJobQuestionsCommand,
  ): Promise<JobQuestion[]> {
    const job = await this.jobRepository.findById(command.jobId);
    if (!job) {
      throw new JobNotFoundError();
    }
    job.assertOwnedBy(command.companyProfileId);
    return this.jobRepository.updateQuestions(
      command.jobId,
      command.questions,
    );
  }
}
