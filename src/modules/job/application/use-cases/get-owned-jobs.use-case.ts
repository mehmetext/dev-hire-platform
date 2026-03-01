import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobRepository } from '../repositories/job.repository';

export class GetOwnedJobsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(companyProfileId: string): Promise<Job[]> {
    return this.jobRepository.findAllOwnedJobs(companyProfileId);
  }
}
