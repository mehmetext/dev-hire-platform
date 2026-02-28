import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobNotFoundError } from '../../domain/errors';
import { JobRepository } from '../repositories/job.repository';

export class GetJobByIdUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new JobNotFoundError();
    }
    return job;
  }
}
