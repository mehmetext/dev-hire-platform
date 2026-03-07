import { Inject } from '@nestjs/common';
import { JobNotFoundError } from '../../domain/errors';
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
    job.assertOwnedBy(companyProfileId);
    await this.jobRepository.delete(id);
  }
}
