import { Inject, UnauthorizedException } from '@nestjs/common';
import { CandidateCVNotFoundError } from 'src/modules/job/domain/errors';
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

    if (existing.candidateProfileId !== params.candidateProfileId) {
      throw new UnauthorizedException('You are not allowed to delete this CV');
    }

    await this.candidateRepository.deleteCv(params.id);
  }
}
