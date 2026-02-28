import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { CreateJobCommand } from '../dtos/create-job.command';
import { JobRepository } from '../repositories/job.repository';

export class CreateJobUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(command: CreateJobCommand): Promise<Job> {
    return this.jobRepository.create(command);
  }
}
