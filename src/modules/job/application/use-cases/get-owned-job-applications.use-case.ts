import { Inject } from '@nestjs/common';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { GetOwnedJobApplicationsCommand } from '../dtos/get-owned-job-applications.command';
import { JobRepository } from '../repositories/job.repository';

export class GetOwnedJobApplicationsUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(
    command: GetOwnedJobApplicationsCommand,
  ): Promise<JobApplication[]> {
    return this.jobRepository.findAllOwnedJobApplications(command);
  }
}
