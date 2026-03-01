import { Inject } from '@nestjs/common';
import { JobApplicationStatus } from '../../domain/enums/job-application-status.enum';
import {
  JobApplicationNotFoundError,
  JobApplicationNotPendingError,
} from '../../domain/errors';
import { WithdrawJobCommand } from '../dtos/withdraw-job.command';
import { JobRepository } from '../repositories/job.repository';

export class WithdrawJobUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: WithdrawJobCommand): Promise<void> {
    const jobApplication =
      await this.jobRepository.findApplicationByJobIdAndCandidateProfileId(
        command.jobId,
        command.candidateProfileId,
      );

    if (!jobApplication) {
      throw new JobApplicationNotFoundError();
    }

    if (jobApplication.status !== JobApplicationStatus.PENDING) {
      throw new JobApplicationNotPendingError();
    }

    await this.jobRepository.withdraw(command);
  }
}
