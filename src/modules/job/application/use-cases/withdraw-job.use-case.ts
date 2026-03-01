import { Inject } from '@nestjs/common';
import { WithdrawJobCommand } from '../dtos/withdraw-job.command';
import { JobRepository } from '../repositories/job.repository';

export class WithdrawJobUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: WithdrawJobCommand): Promise<void> {
    await this.jobRepository.withdraw(command);
  }
}
