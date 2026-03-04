import { Inject } from '@nestjs/common';
import { CandidateCV } from '../../domain/entities/candidate-cv.entity';
import { CandidateRepository } from '../repositories/candidate.repository';

export class CreateCandidateCvUseCase {
  constructor(
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(params: {
    candidateProfileId: string;
    title?: string;
    url: string;
  }): Promise<CandidateCV> {
    return this.candidateRepository.createCv(params);
  }
}
