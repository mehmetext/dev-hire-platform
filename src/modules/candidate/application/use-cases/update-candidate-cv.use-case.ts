import { Inject } from '@nestjs/common';
import { CandidateCV } from '../../domain/entities/candidate-cv.entity';
import { CandidateCVNotFoundError } from '../../domain/errors';
import { CandidateRepository } from '../repositories/candidate.repository';

export class UpdateCandidateCvUseCase {
  constructor(
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(params: {
    id: string;
    candidateProfileId: string;
    title?: string;
    url?: string;
  }): Promise<CandidateCV> {
    const existing = await this.candidateRepository.findCvById(params.id);

    if (!existing) {
      throw new CandidateCVNotFoundError();
    }

    existing.assertBelongsTo(params.candidateProfileId);

    return this.candidateRepository.updateCv({
      id: params.id,
      candidateProfileId: params.candidateProfileId,
      title: params.title ?? existing.title,
      url: params.url ?? existing.url,
    });
  }
}
