import { Inject } from '@nestjs/common';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JobRepository } from '../repositories/job.repository';

export class GetJobApplicationsByJobIdUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(jobId: string): Promise<JobApplication[]> {
    return this.jobRepository.findAllJobApplicationsByJobId(jobId);
  }
}
