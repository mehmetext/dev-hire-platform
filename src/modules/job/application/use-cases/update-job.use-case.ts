import { Job } from '../../domain/entities/job.entity';
import { JobNotFoundError } from '../../domain/errors';
import { UpdateJobCommand } from '../dtos/update-job.command';
import { JobRepository } from '../repositories/job.repository';

export class UpdateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: UpdateJobCommand): Promise<Job> {
    const job = await this.jobRepository.findById(command.id);
    if (!job) {
      throw new JobNotFoundError();
    }
    return this.jobRepository.update(command);
  }
}
