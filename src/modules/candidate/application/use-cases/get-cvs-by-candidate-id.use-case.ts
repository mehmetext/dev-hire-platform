import { Inject } from '@nestjs/common';
import { CandidateCV } from '../../domain/entities/candidate-cv.entity';
import { CandidateRepository } from '../repositories/candidate.repository';

export class GetCvsByCandidateIdUseCase {
  constructor(
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(candidateId: string): Promise<CandidateCV[]> {
    return this.candidateRepository.findCvsByCandidateId(candidateId);
  }
}
