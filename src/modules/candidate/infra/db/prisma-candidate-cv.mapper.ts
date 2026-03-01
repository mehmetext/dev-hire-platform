import {
  Prisma,
  CandidateCV as PrismaCandidateCv,
} from 'src/generated/prisma/client';
import { CandidateCV } from '../../domain/entities/candidate-cv.entity';

export class PrismaCandidateCvMapper {
  static toDomain(candidateCv: PrismaCandidateCv): CandidateCV {
    return new CandidateCV(
      candidateCv.id,
      candidateCv.candidateProfileId,
      candidateCv.title ?? undefined,
      candidateCv.url,
      candidateCv.createdAt,
      candidateCv.updatedAt,
      candidateCv.deletedAt ?? undefined,
    );
  }

  static toCreatePersistence(
    entity: CandidateCV,
  ): Prisma.CandidateCVUncheckedCreateInput {
    return {
      candidateProfileId: entity.candidateProfileId,
      title: entity.title ?? undefined,
      url: entity.url,
    };
  }

  static toUpdatePersistence(
    entity: CandidateCV,
  ): Prisma.CandidateCVUncheckedUpdateInput {
    return PrismaCandidateCvMapper.toCreatePersistence(entity);
  }
}
