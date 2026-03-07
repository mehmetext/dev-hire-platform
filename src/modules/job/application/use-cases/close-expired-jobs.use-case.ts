import { Inject, Injectable } from '@nestjs/common';
import { JobRepository } from '../repositories/job.repository';

@Injectable()
export class CloseExpiredJobsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(): Promise<void> {
    await this.jobRepository.closeExpiredJobs();
  }
}
