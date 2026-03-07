import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobNotFoundError } from '../../domain/errors';
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
    job.assertOwnedBy(command.companyProfileId);
    return this.jobRepository.update(command);
  }
}
