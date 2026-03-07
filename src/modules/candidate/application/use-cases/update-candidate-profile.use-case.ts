import { Inject } from '@nestjs/common';
import { CandidateProfile } from '../../domain/entities/candidate-profile.entity';
import { CandidateProfileNotFoundError } from '../../domain/errors';
import { UpdateCandidateProfileCommand } from '../dtos/update-candidate-profile.command';
import { CandidateRepository } from '../repositories/candidate.repository';

export class UpdateCandidateProfileUseCase {
  constructor(
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(
    command: UpdateCandidateProfileCommand,
  ): Promise<CandidateProfile> {
    const existing = await this.candidateRepository.findById(command.id);

    if (!existing) {
      throw new CandidateProfileNotFoundError();
    }

    existing.assertOwnedBy(command.userId);

    const updated = CandidateProfile.create({
      id: existing.id,
      userId: existing.userId,
      firstName: command.firstName ?? existing.firstName,
      lastName: command.lastName ?? existing.lastName,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
      deletedAt: existing.deletedAt,
    });

    return this.candidateRepository.update(updated);
  }
}
