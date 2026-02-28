import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobNotAllowedError, JobNotFoundError } from '../../domain/errors';
import { UpdateJobCommand } from '../dtos/update-job.command';
import { JobRepository } from '../repositories/job.repository';

export class UpdateJobUseCase {
  constructor(
    @Inject(JobRepository) private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: UpdateJobCommand): Promise<Job> {
    const job = await this.jobRepository.findById(command.id);
    if (!job) {
      throw new JobNotFoundError();
    }
    if (command.companyProfileId !== job.companyProfileId) {
      throw new JobNotAllowedError();
    }
    return this.jobRepository.update(command);
  }
}
