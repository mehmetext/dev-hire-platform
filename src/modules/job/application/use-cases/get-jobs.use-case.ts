import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobRepository } from '../repositories/job.repository';

export class GetJobsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(): Promise<Job[]> {
    return this.jobRepository.findAll();
  }
}
