import { Inject } from '@nestjs/common';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JobNotFoundError } from '../../domain/errors';
import { GetJobApplicationsByJobIdCommand } from '../dtos/get-job-applications-by-job-id.command';
import { JobRepository } from '../repositories/job.repository';

export class GetJobApplicationsByJobIdUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(
    getJobApplicationsByJobIdCommand: GetJobApplicationsByJobIdCommand,
  ): Promise<JobApplication[]> {
    const job = await this.jobRepository.findById(
      getJobApplicationsByJobIdCommand.jobId,
    );
    if (!job) {
      throw new JobNotFoundError();
    }
    job.assertOwnedBy(getJobApplicationsByJobIdCommand.companyProfileId);
    return this.jobRepository.findAllJobApplicationsByJobId(
      getJobApplicationsByJobIdCommand.jobId,
    );
  }
}
