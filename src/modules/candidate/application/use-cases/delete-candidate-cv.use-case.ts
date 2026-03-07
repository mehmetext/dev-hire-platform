import { Inject } from '@nestjs/common';
import { CandidateCVNotFoundError } from '../../domain/errors';
import { CandidateRepository } from '../repositories/candidate.repository';

export class DeleteCandidateCvUseCase {
  constructor(
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(params: {
    id: string;
    candidateProfileId: string;
  }): Promise<void> {
    const existing = await this.candidateRepository.findCvById(params.id);

    if (!existing) {
      throw new CandidateCVNotFoundError();
    }

    existing.assertBelongsTo(params.candidateProfileId);

    await this.candidateRepository.deleteCv(params.id);
  }
}
