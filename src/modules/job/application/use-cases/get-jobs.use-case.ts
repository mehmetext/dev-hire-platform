import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { GetJobsCommand } from '../dtos/get-jobs.command';
import { JobRepository } from '../repositories/job.repository';

export class GetJobsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: GetJobsCommand): Promise<Job[]> {
    return this.jobRepository.findAll(command);
  }
}
