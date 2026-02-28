import {
  Prisma,
  CandidateProfile as PrismaCandidateProfile,
} from 'src/generated/prisma/client';
import { CandidateProfile } from '../../domain/entities/candidate-profile.entity';

export class PrismaCandidateMapper {
  static toDomain(candidateProfile: PrismaCandidateProfile): CandidateProfile {
    return new CandidateProfile(
      candidateProfile.id,
      candidateProfile.firstName,
      candidateProfile.lastName,
      candidateProfile.userId,
      candidateProfile.createdAt,
      candidateProfile.updatedAt,
      candidateProfile.deletedAt ?? undefined,
    );
  }

  static toCreatePersistence(
    entity: CandidateProfile,
  ): Prisma.CandidateProfileUncheckedCreateInput {
    return {
      firstName: entity.firstName,
      lastName: entity.lastName,
      userId: entity.userId,
    };
  }

  static toUpdatePersistence(
    entity: CandidateProfile,
  ): Prisma.CandidateProfileUncheckedUpdateInput {
    return {
      firstName: entity.firstName,
      lastName: entity.lastName,
      userId: entity.userId,
      deletedAt: entity.deletedAt,
    };
  }
}
