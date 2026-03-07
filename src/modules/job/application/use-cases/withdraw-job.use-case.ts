import { Inject } from '@nestjs/common';
import { JobApplicationNotFoundError } from '../../domain/errors';
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

    jobApplication.assertCanWithdraw();

    await this.jobRepository.withdraw(command);
  }
}
