import { Inject } from '@nestjs/common';
import { ApplyJobCommand } from '../dtos/apply-job.command';
import { JobRepository } from '../repositories/job.repository';

export class ApplyJobUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: ApplyJobCommand): Promise<void> {
    await this.jobRepository.apply(command);
  }
}
