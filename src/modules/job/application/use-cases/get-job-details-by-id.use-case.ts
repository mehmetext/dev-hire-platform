import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobNotFoundError } from '../../domain/errors';
import { JobRepository } from '../repositories/job.repository';

export class GetJobDetailsByIdUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(id: string): Promise<Job | null> {
    const job = await this.jobRepository.findById(id, {
      includeJobQuestions: true,
    });
    if (!job) {
      throw new JobNotFoundError();
    }
    return job;
  }
}
