import { Job } from '../../domain/entities/job.entity';
import { CreateJobCommand } from '../dtos/create-job.command';
import { JobRepository } from '../repositories/job.repository';

export class CreateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: CreateJobCommand): Promise<Job> {
    return this.jobRepository.create(command);
  }
}
