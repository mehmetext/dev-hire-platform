import { Inject } from '@nestjs/common';
import { JobNotAllowedError, JobNotFoundError } from '../../domain/errors';
import { JobRepository } from '../repositories/job.repository';

export class DeleteJobUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(id: string, companyProfileId: string): Promise<void> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new JobNotFoundError();
    }
    if (job.companyProfileId !== companyProfileId) {
      throw new JobNotAllowedError();
    }
    await this.jobRepository.delete(id);
  }
}
