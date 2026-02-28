import { JobNotFoundError } from '../../domain/errors';
import { JobRepository } from '../repositories/job.repository';

export class DeleteJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(id: string): Promise<void> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new JobNotFoundError();
    }
    await this.jobRepository.delete(id);
  }
}
