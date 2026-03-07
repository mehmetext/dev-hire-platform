import { Inject } from '@nestjs/common';
import {
  JobApplicationNotFoundError,
  JobNotFoundError,
} from '../../domain/errors';
import { UpdateJobApplicationStatusByCompanyCommand } from '../dtos/update-job-application-status-by-company.command';
import { JobRepository } from '../repositories/job.repository';

export class UpdateJobApplicationStatusByCompanyUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(
    command: UpdateJobApplicationStatusByCompanyCommand,
  ): Promise<void> {
    const jobApplication =
      await this.jobRepository.findApplicationByJobIdAndCandidateProfileId(
        command.jobId,
        command.candidateProfileId,
      );

    if (!jobApplication) {
      throw new JobApplicationNotFoundError();
    }

    const job = await this.jobRepository.findById(command.jobId);

    if (!job) {
      throw new JobNotFoundError();
    }

    job.assertOwnedBy(command.companyProfileId);

    return this.jobRepository.updateJobApplicationStatusByCompany(command);
  }
}
