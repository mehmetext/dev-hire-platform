import { Inject } from '@nestjs/common';
import { CandidateRepository } from 'src/modules/candidate/application/repositories/candidate.repository';
import { CandidateCVNotFoundError } from '../../domain/errors';
import { ApplyJobCommand } from '../dtos/apply-job.command';
import { JobRepository } from '../repositories/job.repository';

export class ApplyJobUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(command: ApplyJobCommand): Promise<void> {
    const candidateCV = await this.candidateRepository.findCvById(
      command.candidateCVId,
    );

    if (!candidateCV) {
      throw new CandidateCVNotFoundError();
    }

    await this.jobRepository.apply(command);
  }
}
