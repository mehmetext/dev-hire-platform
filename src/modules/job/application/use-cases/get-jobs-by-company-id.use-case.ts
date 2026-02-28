import { Inject } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobRepository } from '../repositories/job.repository';

export class GetJobsByCompanyIdUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(companyId: string): Promise<Job[]> {
    return this.jobRepository.findAllByCompanyId(companyId);
  }
}
